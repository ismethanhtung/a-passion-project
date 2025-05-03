import { useState, useRef, useCallback, useEffect } from 'react';

type AudioRecorderHookProps = {
  onRecordingComplete?: (blob: Blob, url: string) => void;
  onRecordingError?: (error: Error) => void;
  audioConfig?: MediaTrackConstraints;
};

type AudioRecorderHookReturn = {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  isSupported: boolean;
  error: string | null;
};

/**
 * Custom hook for audio recording
 * @param props Configuration options for audio recording
 * @returns Audio recording state and controls
 */
export function useAudioRecorder({
  onRecordingComplete,
  onRecordingError,
  audioConfig = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
}: AudioRecorderHookProps = {}): AudioRecorderHookReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Check if MediaRecorder is supported
  const isSupported = typeof window !== 'undefined' && 
    typeof window.MediaRecorder !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices !== 'undefined' &&
    typeof navigator.mediaDevices.getUserMedia !== 'undefined';
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const errorMessage = 'Audio recording is not supported in this browser';
      setError(errorMessage);
      if (onRecordingError) {
        onRecordingError(new Error(errorMessage));
      }
      return;
    }
    
    try {
      // Reset state
      setError(null);
      chunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConfig,
      });
      
      streamRef.current = stream;
      
      // Determine best audio format
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
      
      // Create MediaRecorder
      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      
      // Set up event handlers
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        try {
          // Create blob from chunks
          if (chunksRef.current.length === 0) {
            const errorMessage = 'No audio data recorded';
            setError(errorMessage);
            if (onRecordingError) {
              onRecordingError(new Error(errorMessage));
            }
            return;
          }
          
          const blob = new Blob(chunksRef.current, { type: mimeType });
          
          if (blob.size > 0) {
            // Create URL for playback
            const url = URL.createObjectURL(blob);
            setAudioBlob(blob);
            setAudioUrl(url);
            
            if (onRecordingComplete) {
              onRecordingComplete(blob, url);
            }
          } else {
            const errorMessage = 'Recorded audio has no data';
            setError(errorMessage);
            if (onRecordingError) {
              onRecordingError(new Error(errorMessage));
            }
          }
        } catch (error) {
          const errorMessage = `Error processing recorded audio: ${error instanceof Error ? error.message : 'Unknown error'}`;
          setError(errorMessage);
          if (onRecordingError && error instanceof Error) {
            onRecordingError(error);
          } else if (onRecordingError) {
            onRecordingError(new Error(errorMessage));
          }
        } finally {
          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          
          setIsRecording(false);
        }
      };
      
      mediaRecorderRef.current = recorder;
      
      // Start recording
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      // Handle permission errors
      let errorMessage = 'Error starting audio recording';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else {
          errorMessage = `Error starting audio recording: ${error.message}`;
        }
      }
      
      setError(errorMessage);
      if (onRecordingError && error instanceof Error) {
        onRecordingError(error);
      } else if (onRecordingError) {
        onRecordingError(new Error(errorMessage));
      }
    }
  }, [isSupported, audioConfig, onRecordingComplete, onRecordingError]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
    
    setIsRecording(false);
  }, []);
  
  // Clear recording
  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
  }, [audioUrl]);
  
  return {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    clearRecording,
    isSupported,
    error,
  };
}
