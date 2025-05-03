/**
 * Speech-to-Text Service
 * 
 * This service provides methods for converting speech to text using various APIs.
 */

/**
 * Convert audio blob to text using the server API
 * @param audioBlob The audio blob to convert
 * @param text The original text (for context)
 * @param language The language code
 * @returns The transcribed text and analysis
 */
export async function convertSpeechToText(
  audioBlob: Blob,
  text: string,
  language: string
): Promise<{ transcription: string; analysis?: any }> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('text', text);
    formData.append('language', language);

    // Send request to server
    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse response
    const data = await response.json();
    return {
      transcription: data.transcription || '',
      analysis: data.analysis,
    };
  } catch (error) {
    console.error('Error converting speech to text:', error);
    throw error;
  }
}

/**
 * Analyze pronunciation by comparing recorded text with original text
 * @param recordedText The text transcribed from speech
 * @param originalText The original text to compare against
 * @param language The language code
 * @returns Analysis of pronunciation
 */
export async function analyzePronunciation(
  recordedText: string,
  originalText: string,
  language: string
): Promise<any> {
  try {
    // Send request to server
    const response = await fetch('/api/pronunciation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recordedText,
        originalText,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse response
    return await response.json();
  } catch (error) {
    console.error('Error analyzing pronunciation:', error);
    throw error;
  }
}

/**
 * Process audio recording for pronunciation analysis
 * @param audioBlob The audio blob to process
 * @param originalText The original text to compare against
 * @param language The language code
 * @returns Analysis of pronunciation
 */
export async function processPronunciationAudio(
  audioBlob: Blob,
  originalText: string,
  language: string
): Promise<any> {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('text', originalText);
    formData.append('language', language);

    // Send request directly to pronunciation API
    const response = await fetch('/api/pronunciation', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse response
    return await response.json();
  } catch (error) {
    console.error('Error processing pronunciation audio:', error);
    throw error;
  }
}
