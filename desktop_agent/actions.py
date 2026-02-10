"""
Action executor for the Desktop Agent.
Translates structured action dicts from the VLM into OS-level inputs.
"""

import time
import pyautogui
import pyperclip
import pygetwindow as gw

# ── Safety settings ──────────────────────────────────────
pyautogui.FAILSAFE = True   # move mouse to top-left corner to abort
pyautogui.PAUSE = 0.3       # small pause between pyautogui calls


def execute_action(action: dict) -> str:
    """
    Execute a single action and return a human-readable result string.
    """
    action_type = action.get("type", "unknown")

    try:
        match action_type:

            # ── Mouse actions ────────────────────────────────────
            case "left_click":
                x, y = int(action["x"]), int(action["y"])
                pyautogui.click(x, y)
                return f"Left-clicked at ({x}, {y})"

            case "right_click":
                x, y = int(action["x"]), int(action["y"])
                pyautogui.rightClick(x, y)
                return f"Right-clicked at ({x}, {y})"

            case "double_click":
                x, y = int(action["x"]), int(action["y"])
                pyautogui.doubleClick(x, y)
                return f"Double-clicked at ({x}, {y})"

            case "drag":
                sx = int(action["start_x"])
                sy = int(action["start_y"])
                ex = int(action["end_x"])
                ey = int(action["end_y"])
                dur = float(action.get("duration", 0.5))
                pyautogui.moveTo(sx, sy)
                time.sleep(0.05)
                pyautogui.mouseDown()
                pyautogui.moveTo(ex, ey, duration=dur)
                pyautogui.mouseUp()
                return f"Dragged from ({sx},{sy}) to ({ex},{ey})"

            # ── Keyboard actions ─────────────────────────────────
            case "type_text":
                text = str(action["text"])
                _type_via_clipboard(text)
                preview = text[:80] + ("..." if len(text) > 80 else "")
                return f'Typed: "{preview}"'

            case "press_key":
                key = str(action["key"]).strip().lower()
                if "+" in key:
                    keys = [k.strip() for k in key.split("+")]
                    pyautogui.hotkey(*keys)
                else:
                    pyautogui.press(key)
                return f"Pressed key: {key}"

            # ── Scroll ───────────────────────────────────────────
            case "scroll":
                x = int(action.get("x", 0))
                y = int(action.get("y", 0))
                clicks = int(action.get("clicks", -3))
                if x and y:
                    pyautogui.moveTo(x, y)
                pyautogui.scroll(clicks)
                direction = "up" if clicks > 0 else "down"
                return f"Scrolled {direction} ({abs(clicks)}) at ({x},{y})"

            # ── Wait ─────────────────────────────────────────────
            case "wait":
                seconds = min(float(action.get("seconds", 1.0)), 10.0)
                time.sleep(seconds)
                return f"Waited {seconds:.1f}s"

            # ── Window management ────────────────────────────────
            case "list_windows":
                return _list_windows()

            case "switch_window":
                title = str(action["title"])
                return _switch_window(title)

            case "open_search":
                return _open_search()

            # ── Unknown ──────────────────────────────────────────
            case _:
                return f"⚠️ Unknown action type: {action_type}"

    except KeyError as e:
        return f"❌ Missing parameter {e} for '{action_type}'"
    except Exception as e:
        return f"❌ Error executing '{action_type}': {e}"


# ── Helper functions ─────────────────────────────────────────


def _type_via_clipboard(text: str) -> None:
    """Type text via clipboard paste (reliable, handles unicode)."""
    try:
        old_clipboard = pyperclip.paste()
    except Exception:
        old_clipboard = ""
    pyperclip.copy(text)
    time.sleep(0.05)
    pyautogui.hotkey("ctrl", "v")
    time.sleep(0.1)
    try:
        pyperclip.copy(old_clipboard)
    except Exception:
        pass


def _list_windows() -> str:
    """List all visible windows with their titles."""
    windows = gw.getAllWindows()
    visible = []
    for w in windows:
        if w.title and w.title.strip() and w.visible:
            visible.append(f"  • \"{w.title}\"")
    if not visible:
        return "No visible windows found."
    header = f"Found {len(visible)} open windows:\n"
    return header + "\n".join(visible)


def _switch_window(title_query: str) -> str:
    """
    Switch to a window whose title contains the given query.
    Uses pygetwindow to find and activate the window.
    """
    windows = gw.getAllWindows()
    query_lower = title_query.lower()

    # Find best match: exact first, then substring
    match = None
    for w in windows:
        if not w.title or not w.visible:
            continue
        if w.title.lower() == query_lower:
            match = w
            break
        if query_lower in w.title.lower() and match is None:
            match = w

    if match is None:
        available = [w.title for w in windows if w.title and w.visible]
        return (
            f"❌ No window matching \"{title_query}\" found. "
            f"Available: {available[:10]}"
        )

    try:
        # Restore if minimized, then activate
        if match.isMinimized:
            match.restore()
            time.sleep(0.3)
        match.activate()
        time.sleep(0.3)
        return f"Switched to window: \"{match.title}\""
    except Exception as e:
        # Fallback: use alt+tab approach
        try:
            pyautogui.hotkey("alt", "tab")
            time.sleep(0.5)
            return f"Used alt+tab (direct activate failed: {e})"
        except Exception:
            return f"❌ Failed to switch window: {e}"


def _open_search() -> str:
    """
    Open Windows Search bar using the Win+S keyboard shortcut.
    This is guaranteed and does not rely on clicking.
    """
    pyautogui.hotkey("win", "s")
    time.sleep(0.8)  # wait for search UI to appear
    return "Opened Windows Search (Win+S)"
