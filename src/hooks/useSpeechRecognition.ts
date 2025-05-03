import { useState, useEffect, useRef, useCallback } from 'react';

// Define types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognitionHookProps = {
  language: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
};

type SpeechRecognitionHookReturn = {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
};

/**
 * Custom hook for speech recognition
 * @param props Configuration options for speech recognition
 * @returns Speech recognition state and controls
 */
export function useSpeechRecognition({
  language = 'en-US',
  continuous = false,
  interimResults = false,
  onResult,
  onError,
}: SpeechRecognitionHookProps): SpeechRecognitionHookReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  
  // Create a ref for the recognition instance
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = interimResults;
    recognitionRef.current.lang = language;
    
    // Set up event handlers
    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
      
      if (onResult) {
        onResult(result);
      }
    };
    
    recognitionRef.current.onerror = (event: any) => {
      const errorMessage = getErrorMessage(event.error);
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, [isSupported, language, continuous, interimResults, onResult, onError]);
  
  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);
  
  // Start listening
  const startListening = useCallback(() => {
    setError(null);
    
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError('Error starting speech recognition');
      }
    }
  }, [isSupported]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    }
  }, []);
  
  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorType: string): string {
  switch (errorType) {
    case 'network':
      return 'Network error occurred. Check your internet connection.';
    case 'not-allowed':
    case 'permission-denied':
      return 'Microphone access denied. Please allow microphone access in your browser settings.';
    case 'no-speech':
      return 'No speech detected. Please speak louder or check your microphone.';
    case 'audio-capture':
      return 'Audio capture failed. Please check your microphone connection.';
    case 'aborted':
      return 'Speech recognition was aborted.';
    default:
      return `Speech recognition error: ${errorType}`;
  }
}
