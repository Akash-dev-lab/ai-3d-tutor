import { useCallback, useEffect, useRef } from 'react';

export const useSpeech = () => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const utteranceRef = useRef(null);

    const speak = useCallback((text, isMuted = false) => {
        if (!synth) return;

        // Cancel any ongoing speech
        synth.cancel();

        if (!text || isMuted) return;

        const utterance = new SpeechSynthesisUtterance(text);
        
        // 1. Get all available voices
        const voices = synth.getVoices();
        
        // 2. Prioritize "Sweet, Calm, Professional" female voices
        // Note: Voice availability depend heavily on the OS/Browser
        const preferredTerms = ['Google US English', 'Microsoft Zira', 'Samantha', 'Victoria', 'Natural', 'Neural', 'Female'];
        
        let selectedVoice = null;
        
        // Find English voices first
        const enVoices = voices.filter(v => v.lang.startsWith('en'));
        
        for (const term of preferredTerms) {
            selectedVoice = enVoices.find(v => v.name.includes(term));
            if (selectedVoice) break;
        }

        // Fallback to any English voice
        if (!selectedVoice) {
            selectedVoice = enVoices[0];
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // 3. Tuning for "Sweet and Calm" delivery
        utterance.rate = 0.92;  // Slightly slower = calmer, educational
        utterance.pitch = 1.05; // Slightly higher = sweeter, friendlier
        utterance.volume = 1.0;

        utteranceRef.current = utterance;
        synth.speak(utterance);
    }, [synth]);

    const stop = useCallback(() => {
        if (synth) {
            synth.cancel();
        }
    }, [synth]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (synth) {
                synth.cancel();
            }
        };
    }, [synth]);

    return { speak, stop };
};
