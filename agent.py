"""
Desktop Agent — CLI entry point.
Usage:
    python agent.py "Open Notepad and type Hello World"
    python agent.py --max-steps 30 --delay 2.0 --save-screenshots "Your task here"
"""

import argparse
import sys

from dotenv import load_dotenv

load_dotenv()


def main():
    parser = argparse.ArgumentParser(
        description="🤖 Desktop Agent — Vision-driven desktop automation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            '  python agent.py "Open Notepad and type Hello World"\n'
            '  python agent.py --save-screenshots "Search Google for cats"\n'
            '  python agent.py --max-steps 30 "Open Calculator and compute 42 * 17"\n'
        ),
    )
    parser.add_argument("task", help="Natural language task description")
    parser.add_argument(
        "--max-steps", type=int, default=50,
        help="Max observe→act cycles before aborting (default: 50)",
    )
    parser.add_argument(
        "--delay", type=float, default=1.5,
        help="Seconds to wait after each action for UI response (default: 1.5)",
    )
    parser.add_argument(
        "--grid-spacing", type=int, default=100,
        help="Pixel spacing for the coordinate grid overlay (default: 100)",
    )
    parser.add_argument(
        "--save-screenshots", action="store_true",
        help="Save each screenshot to disk for debugging",
    )
    parser.add_argument(
        "--model", type=str, default="gemini-2.5-flash",
        help="Gemini model to use (default: gemini-2.5-flash)",
    )

    args = parser.parse_args()

    # Import here so --help works without dependencies installed
    from desktop_agent import DesktopAgent

    agent = DesktopAgent(
        model=args.model,
        max_steps=args.max_steps,
        grid_spacing=args.grid_spacing,
        action_delay=args.delay,
        save_screenshots=args.save_screenshots,
    )

    try:
        result = agent.run(args.task)
        print(f"\n🏁 Final result: {result}")
    except KeyboardInterrupt:
        print("\n\n🛑 Agent interrupted by user.")
        sys.exit(1)


if __name__ == "__main__":
    main()
