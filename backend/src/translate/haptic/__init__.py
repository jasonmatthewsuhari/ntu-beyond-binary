"""Haptic input translation module."""

from .take_haptic_input import (
    translate_haptic_to_english,
    recognize_pattern,
    add_custom_pattern,
    load_pattern_library
)

__all__ = [
    'translate_haptic_to_english',
    'recognize_pattern',
    'add_custom_pattern',
    'load_pattern_library'
]
