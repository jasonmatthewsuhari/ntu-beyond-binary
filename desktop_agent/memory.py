"""
Memory / history tracking for the Desktop Agent.
Maintains a record of all actions taken and their results,
and formats them for inclusion in the VLM prompt.
"""

from dataclasses import dataclass, field


@dataclass
class ActionRecord:
    """Record of a single action step."""
    step: int
    thinking: str
    action_type: str
    action_params: dict
    result: str
    plan: list[str]
    current_step: int


@dataclass
class Memory:
    """
    Stores the task and a chronological history of all actions.
    Provides formatted history for the VLM context window.
    """
    task: str
    history: list[ActionRecord] = field(default_factory=list)

    def add(self, record: ActionRecord) -> None:
        """Append an action record."""
        self.history.append(record)

    def format_history(self) -> str:
        """
        Format the action history as a concise text block for the VLM.
        Keeps recent entries detailed, older entries summarized.
        """
        if not self.history:
            return "No actions taken yet. This is the first step."

        lines: list[str] = []
        total = len(self.history)

        for i, record in enumerate(self.history):
            # Show full detail for last 10 steps, summary for older ones
            if total > 15 and i < total - 10:
                # Compact format for older entries
                lines.append(
                    f"  [{record.step}] {record.action_type}"
                    f"({self._compact_params(record.action_params)}) → {record.result}"
                )
            else:
                # Detailed format for recent entries
                lines.append(f"Step {record.step}:")
                lines.append(f"  Thought: {record.thinking[:150]}")
                lines.append(
                    f"  Action: {record.action_type}"
                    f"({self._compact_params(record.action_params)})"
                )
                lines.append(f"  Result: {record.result}")
                if record.plan:
                    lines.append(
                        f"  Plan progress: step {record.current_step + 1}"
                        f"/{len(record.plan)}"
                    )
                lines.append("")

        return "\n".join(lines)

    def is_stuck(self, lookback: int = 3) -> bool:
        """
        Detect if the agent is stuck repeating the same action.
        Returns True if the last `lookback` actions are identical.
        """
        if len(self.history) < lookback:
            return False

        recent = self.history[-lookback:]
        first = recent[0]
        return all(
            r.action_type == first.action_type
            and r.action_params == first.action_params
            for r in recent
        )

    @staticmethod
    def _compact_params(params: dict) -> str:
        """Format action params compactly."""
        parts = []
        for k, v in params.items():
            if isinstance(v, str) and len(v) > 40:
                v = v[:40] + "..."
            parts.append(f"{k}={v}")
        return ", ".join(parts)
