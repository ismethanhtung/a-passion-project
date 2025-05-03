/**
 * Azure Speech Service
 * 
 * This service provides integration with Azure Speech Services for accurate speech-to-text conversion.
 * Azure offers a free tier with 5 hours of audio processing per month.
 * 
 * API Documentation: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/
 */

import axios from 'axios';

/**
 * Convert audio file to text using Azure Speech Services
 * @param audioFile The audio file to transcribe
 * @param language The language code (e.g., 'en-US', 'vi-VN')
 * @returns The transcribed text
 */
export async function transcribeAudioWithAzure(audioFile: File, language: string): Promise<string> {
    // Check if API key and region are available
    const apiKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION || 'eastus';
    
    if (!apiKey) {
        console.warn('AZURE_SPEECH_KEY not found, cannot use Azure Speech service');
        throw new Error('Azure Speech API key not configured');
    }

    try {
        // Convert audio file to ArrayBuffer
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Azure Speech REST API endpoint
        const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;
        
        // Set up request parameters
        const params = new URLSearchParams({
            'language': language,
            'format': 'detailed',
            'profanity': 'masked'
        });

        // Make the API request
        const response = await axios.post(`${endpoint}?${params.toString()}`, buffer, {
            headers: {
                'Content-Type': 'audio/wav', // Adjust based on your audio format
                'Ocp-Apim-Subscription-Key': apiKey,
                'Accept': 'application/json'
            }
        });

        // Extract the recognized text
        if (response.data && response.data.DisplayText) {
            return response.data.DisplayText;
        } else if (response.data && response.data.NBest && response.data.NBest.length > 0) {
            return response.data.NBest[0].Display;
        }

        return '';
    } catch (error) {
        console.error('Error transcribing audio with Azure Speech:', error);
        throw error;
    }
}
