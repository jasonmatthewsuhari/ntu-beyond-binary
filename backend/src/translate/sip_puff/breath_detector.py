"""
Sip/puff breath detection using audio frequency analysis.
"""

import numpy as np
from typing import Optional, Dict, Any

class BreathDetector:
    """Detects sip and puff breaths from audio data."""
    
    def __init__(self, sample_rate: int = 44100):
        self.sample_rate = sample_rate
        self.sip_freq_min = 3000  # Hz - high frequency
        self.sip_freq_max = 8000  # Hz
        self.puff_freq_min = 100  # Hz - low frequency
        self.puff_freq_max = 1000  # Hz
        self.intensity_threshold = 0.1
    
    def detect(self, audio_data: np.ndarray) -> Optional[Dict[str, Any]]:
        """
        Detect sip or puff from audio data.
        
        Args:
            audio_data: Audio samples as numpy array
            
        Returns:
            Detection result with type (sip/puff) and intensity
        """
        if len(audio_data) < 512:
            return None
        
        # Compute FFT
        fft = np.fft.rfft(audio_data)
        frequencies = np.fft.rfftfreq(len(audio_data), 1/self.sample_rate)
        magnitude = np.abs(fft)
        
        # Normalize
        if np.max(magnitude) > 0:
            magnitude = magnitude / np.max(magnitude)
        
        # Check sip range (high frequency)
        sip_mask = (frequencies >= self.sip_freq_min) & (frequencies <= self.sip_freq_max)
        sip_energy = np.sum(magnitude[sip_mask])
        
        # Check puff range (low frequency)
        puff_mask = (frequencies >= self.puff_freq_min) & (frequencies <= self.puff_freq_max)
        puff_energy = np.sum(magnitude[puff_mask])
        
        # Determine type based on dominant frequency range
        if sip_energy > self.intensity_threshold and sip_energy > puff_energy * 1.5:
            return {
                'type': 'sip',
                'intensity': float(sip_energy),
                'confidence': min(float(sip_energy), 1.0)
            }
        elif puff_energy > self.intensity_threshold and puff_energy > sip_energy * 1.5:
            return {
                'type': 'puff',
                'intensity': float(puff_energy),
                'confidence': min(float(puff_energy), 1.0)
            }
        
        return None
    
    def calibrate(self, sip_samples: np.ndarray, puff_samples: np.ndarray):
        """
        Calibrate detector based on user's sip and puff samples.
        
        Args:
            sip_samples: Audio samples of user's sip
            puff_samples: Audio samples of user's puff
        """
        # Analyze sip samples
        sip_fft = np.fft.rfft(sip_samples)
        sip_freqs = np.fft.rfftfreq(len(sip_samples), 1/self.sample_rate)
        sip_mag = np.abs(sip_fft)
        
        # Find peak frequency for sip
        sip_peak_idx = np.argmax(sip_mag)
        sip_peak_freq = sip_freqs[sip_peak_idx]
        
        # Analyze puff samples
        puff_fft = np.fft.rfft(puff_samples)
        puff_freqs = np.fft.rfftfreq(len(puff_samples), 1/self.sample_rate)
        puff_mag = np.abs(puff_fft)
        
        # Find peak frequency for puff
        puff_peak_idx = np.argmax(puff_mag)
        puff_peak_freq = puff_freqs[puff_peak_idx]
        
        # Update ranges based on peaks
        self.sip_freq_min = max(100, sip_peak_freq - 1000)
        self.sip_freq_max = min(self.sample_rate / 2, sip_peak_freq + 1000)
        
        self.puff_freq_min = max(50, puff_peak_freq - 500)
        self.puff_freq_max = min(2000, puff_peak_freq + 500)

def detect_breath(audio_data: np.ndarray, sample_rate: int = 44100) -> Optional[Dict[str, Any]]:
    """
    Detect sip or puff from audio data.
    
    Args:
        audio_data: Audio samples
        sample_rate: Sample rate in Hz
        
    Returns:
        Detection result
    """
    detector = BreathDetector(sample_rate)
    return detector.detect(audio_data)

if __name__ == "__main__":
    print("Breath detector ready.")
