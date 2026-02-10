"""
Screenshot capture with optional coordinate grid overlay.
Handles DPI scaling so VLM coordinates match pyautogui's coordinate space.
"""

import io
import pyautogui
import mss
from PIL import Image, ImageDraw, ImageFont


def capture_screenshot(
    grid: bool = True,
    grid_spacing: int = 100,
    monitor_index: int = 1,  # 1 = primary monitor, 0 = all monitors
) -> Image.Image:
    """
    Capture a screenshot of the desktop, resized to logical resolution
    (matching pyautogui's coordinate system), with an optional grid overlay.

    Args:
        grid: Whether to draw a coordinate grid overlay.
        grid_spacing: Spacing between grid lines in logical pixels.
        monitor_index: Which monitor to capture (1=primary, 0=all).

    Returns:
        PIL Image at logical resolution with optional grid.
    """
    # Get logical resolution (what pyautogui uses)
    logical_w, logical_h = pyautogui.size()

    # Capture screenshot at physical resolution
    with mss.mss() as sct:
        monitor = sct.monitors[monitor_index]
        raw = sct.grab(monitor)
        img = Image.frombytes("RGB", raw.size, raw.rgb)

    # Resize to logical resolution so VLM coordinates = pyautogui coordinates
    if img.size != (logical_w, logical_h):
        img = img.resize((logical_w, logical_h), Image.LANCZOS)

    # Draw grid overlay
    if grid:
        img = _draw_grid(img, grid_spacing)

    return img


def _draw_grid(img: Image.Image, spacing: int = 100) -> Image.Image:
    """
    Draw a subtle coordinate grid overlay with labels.
    Uses RGBA blending so the grid doesn't obscure content.
    """
    # Work on an RGBA copy for transparency
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    width, height = img.size

    # Try to load a readable font; fall back to default
    try:
        font = ImageFont.truetype("arial.ttf", 14)
        font_small = ImageFont.truetype("arial.ttf", 11)
    except (IOError, OSError):
        font = ImageFont.load_default()
        font_small = font

    line_color = (255, 50, 50, 45)       # subtle red grid lines
    label_color = (255, 40, 40, 160)     # more visible labels
    label_bg = (0, 0, 0, 90)            # dark background for readability

    # Vertical lines
    for x in range(0, width, spacing):
        draw.line([(x, 0), (x, height)], fill=line_color, width=1)

    # Horizontal lines
    for y in range(0, height, spacing):
        draw.line([(0, y), (width, y)], fill=line_color, width=1)

    # Labels at intersections (every 200px to avoid clutter)
    label_interval = spacing * 2
    for x in range(0, width, label_interval):
        for y in range(0, height, label_interval):
            label = f"{x},{y}"
            # Draw background pill for readability
            bbox = font_small.getbbox(label)
            text_w = bbox[2] - bbox[0]
            text_h = bbox[3] - bbox[1]
            padding = 2
            draw.rectangle(
                [x + 1, y + 1, x + text_w + padding * 2 + 1, y + text_h + padding * 2 + 1],
                fill=label_bg,
            )
            draw.text((x + 1 + padding, y + 1 + padding), label, fill=label_color, font=font_small)

    # Composite overlay onto image
    img_rgba = img.convert("RGBA")
    composited = Image.alpha_composite(img_rgba, overlay)
    return composited.convert("RGB")


def screenshot_to_bytes(img: Image.Image, fmt: str = "PNG") -> bytes:
    """Convert a PIL Image to raw bytes."""
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()
