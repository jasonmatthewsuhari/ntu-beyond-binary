# 🤖 Desktop Agent

A vision-driven autonomous desktop automation agent that uses Gemini 2.5 Flash to observe your screen via screenshots, reason about what it sees, and execute OS-level actions to complete tasks.

## Features

- **Vision-based reasoning** — Uses VLM to understand screenshots with coordinate grid overlay
- **Autonomous execution** — Runs fully autonomously without user confirmation
- **Window management** — List, switch, and manage windows reliably
- **Guaranteed app launching** — Uses Windows Search (Win+S) for reliable app opening
- **Stuck detection** — Automatically detects and warns when repeating the same action
- **DPI-aware** — Handles high-DPI displays correctly

## Installation

Dependencies are already installed via `uv sync`. The agent requires:
- `google-genai` — Gemini API
- `mss` — Fast screenshot capture
- `pyautogui` — Mouse/keyboard automation
- `pygetwindow` — Window management
- `pyperclip` — Clipboard operations
- `Pillow` — Image processing

## Usage

```bash
# Basic usage
uv run python agent.py "Open Notepad and type Hello World"

# With options
uv run python agent.py --max-steps 30 --delay 2.0 "Your task here"

# Save screenshots for debugging
uv run python agent.py --save-screenshots "Search Google for cats"

# See all options
uv run python agent.py --help
```

## Available Actions

| Action | Parameters | Description |
|--------|-----------|-------------|
| `left_click` | x, y | Single left-click at coordinates |
| `right_click` | x, y | Single right-click at coordinates |
| `double_click` | x, y | Double left-click |
| `drag` | start_x, start_y, end_x, end_y | Click and drag |
| `type_text` | text | Type text (via clipboard for reliability) |
| `press_key` | key | Press key or combo (e.g., "ctrl+c", "enter") |
| `scroll` | x, y, clicks | Scroll at position |
| `wait` | seconds | Wait for UI to respond |
| **`list_windows`** | *(none)* | List all open windows |
| **`switch_window`** | title | Switch to window by title |
| **`open_search`** | *(none)* | Open Windows Search (Win+S) |

## How It Works

1. **Observe** — Capture screenshot with coordinate grid overlay
2. **Think** — Send to Gemini 2.5 Flash with task context and history
3. **Act** — Execute the VLM's chosen action via pyautogui
4. **Repeat** — Loop until task is complete or max steps reached

## Important Notes

⚠️ **The agent controls your real desktop!** When running:
- It will type, click, and interact with your actual computer
- Don't use your mouse/keyboard while it's running
- Move mouse to top-left corner to abort (pyautogui FAILSAFE)
- Run from a terminal you don't need to interact with

## Architecture

```
desktop_agent/
├── __init__.py       # Package exports
├── core.py           # Main observe→think→act loop
├── vlm.py            # Gemini API client
├── actions.py        # Action executor (pyautogui)
├── screenshot.py     # Screenshot capture with grid overlay
├── memory.py         # History tracking with stuck detection
└── prompts.py        # System prompts and schemas
```

## Examples

```bash
# Open an application
uv run python agent.py "Open Calculator"

# Web search
uv run python agent.py "Open Chrome and search for Python tutorials"

# File operations
uv run python agent.py "Create a new text file on the Desktop called todo.txt"

# Multi-step tasks
uv run python agent.py "Open Notepad, type a haiku about AI, and save it as haiku.txt"
```

## Tips for Best Results

1. **Be specific** — Clear, detailed tasks work better
2. **One task at a time** — Don't chain too many complex operations
3. **Use --save-screenshots** — Helpful for debugging what the agent saw
4. **Adjust --delay** — Increase if your system is slow to respond
5. **Check window titles** — Use `list_windows` action to see what's open

## Troubleshooting

**Agent types into the wrong window:**
- The agent should use `open_search` and `switch_window` to navigate
- If it clicks the taskbar instead, the VLM may need better prompting

**Actions seem imprecise:**
- The coordinate grid helps, but VLMs aren't pixel-perfect
- Larger UI elements work better than tiny buttons

**Agent gets stuck:**
- Built-in stuck detection warns the VLM after 3 identical actions
- You can manually abort by moving mouse to top-left corner

**Import errors:**
- Make sure to use `uv run python` not just `python`
- Or activate the venv: `.venv\Scripts\activate` (Windows)
