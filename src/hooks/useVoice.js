import { useState, useEffect, useRef, useCallback } from 'react';

export default function useVoice(onResult) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      recognition.onerror = (event) => {
        console.error("[RelayVoice] Recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    } else {
      console.warn("[RelayVoice] Speech recognition not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.abort();
      }
    };
  }, [onResult]);

  const toggleListening = useCallback((e) => {
    if (e) e.preventDefault();
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("[RelayVoice] Hardware already in use or starting:", err);
      }
    }
  }, [isListening, isSupported]);

  return { isSupported, isListening, toggleListening };
}