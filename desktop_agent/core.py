"""
Core agent loop — the observe → think → act cycle.
"""

import time
import traceback

from desktop_agent.screenshot import capture_screenshot
from desktop_agent.vlm import VLMClient
from desktop_agent.actions import execute_action
from desktop_agent.memory import Memory, ActionRecord
from desktop_agent.prompts import build_system_prompt


class DesktopAgent:
    """Vision-driven autonomous desktop automation agent."""

    def __init__(
        self,
        model: str = "gemini-2.5-flash",
        max_steps: int = 50,
        grid_spacing: int = 100,
        action_delay: float = 1.5,
        save_screenshots: bool = False,
    ):
        self.vlm = VLMClient(model=model)
        self.max_steps = max_steps
        self.grid_spacing = grid_spacing
        self.action_delay = action_delay
        self.save_screenshots = save_screenshots

    def run(self, task: str) -> str:
        """Run the agent loop until task is complete or max steps reached."""
        memory = Memory(task=task)
        print(f"\n{'═'*60}\n  🤖 Desktop Agent\n{'═'*60}")
        print(f"  📋 Task: {task}\n{'═'*60}")

        for step in range(self.max_steps):
            result = self._step(step, task, memory)
            if result is not None:
                return result

        print(f"\n⚠️ Max steps ({self.max_steps}) reached.")
        return f"Max steps ({self.max_steps}) reached. Task may be incomplete."

    def _step(self, step: int, task: str, memory: Memory) -> str | None:
        """Execute one observe→think→act cycle. Returns summary if done."""
        print(f"\n{'─'*50}\n  Step {step+1}/{self.max_steps}\n{'─'*50}")

        # 1. Observe
        print("📸 Capturing screenshot...")
        try:
            screenshot = capture_screenshot(grid=True, grid_spacing=self.grid_spacing)
        except Exception as e:
            print(f"❌ Screenshot failed: {e}")
            time.sleep(1)
            return None

        w, h = screenshot.size
        if self.save_screenshots:
            screenshot.save(f"screenshot_step_{step:03d}.png")

        # 2. Think
        system_prompt = build_system_prompt(w, h, self.grid_spacing)
        stuck_warning = ""
        if memory.is_stuck():
            stuck_warning = (
                "\n\n⚠️ WARNING: You repeated the same action 3 times. "
                "Try a completely different approach!"
            )
        user_msg = (
            f"## Task\n{task}\n\n"
            f"## History ({len(memory.history)} steps)\n"
            f"{memory.format_history()}{stuck_warning}\n\n"
            f"Analyze the screenshot and decide your next action."
        )

        print("🧠 Analyzing with VLM...")
        try:
            resp = self.vlm.analyze(system_prompt, screenshot, user_msg)
        except Exception as e:
            print(f"❌ VLM error: {e}")
            traceback.print_exc()
            time.sleep(2)
            return None

        # 3. Parse
        thinking = resp["thinking"]
        plan = resp["plan"]
        cur = resp["current_step"]
        action = resp["action"]
        done = resp["done"]
        summary = resp["summary"]

        # Display
        print(f"\n💭 {thinking[:300]}{'…' if len(thinking)>300 else ''}")
        if plan:
            print(f"\n📋 Plan ({cur+1}/{len(plan)}):")
            for i, s in enumerate(plan):
                print(f"   {'→' if i==cur else ' '} {i+1}. {s}")
        params = {k: v for k, v in action.items() if k != "type"}
        print(f"\n🎯 Action: {action.get('type','?')}({params})")

        if done:
            print(f"\n{'═'*60}\n  ✅ Task Complete! ({len(memory.history)} steps)")
            if summary:
                print(f"  📝 {summary}")
            print(f"{'═'*60}\n")
            return summary or "Task completed."

        # 4. Act
        print("⚡ Executing...")
        result = execute_action(action)
        print(f"   → {result}")

        # 5. Remember
        memory.add(ActionRecord(
            step=step,
            thinking=thinking,
            action_type=action.get("type", "unknown"),
            action_params=params,
            result=result,
            plan=plan,
            current_step=cur,
        ))

        time.sleep(self.action_delay)
        return None
