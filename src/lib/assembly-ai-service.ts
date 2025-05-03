/**
 * AssemblyAI Speech-to-Text Service
 * 
 * This service provides integration with AssemblyAI for accurate speech-to-text conversion.
 * AssemblyAI offers a free tier with 3 hours of audio processing per month.
 * 
 * API Documentation: https://www.assemblyai.com/docs/
 */

import axios from 'axios';

/**
 * Convert audio file to text using AssemblyAI
 * @param audioFile The audio file to transcribe
 * @param language The language code (e.g., 'en-US', 'vi-VN')
 * @returns The transcribed text
 */
export async function transcribeAudioWithAssemblyAI(audioFile: File, language: string): Promise<string> {
    // Check if API key is available
    const apiKey = process.env.ASSEMBLY_AI_API_KEY;
    if (!apiKey) {
        console.warn('ASSEMBLY_AI_API_KEY not found, cannot use AssemblyAI service');
        throw new Error('AssemblyAI API key not configured');
    }

    try {
        // Step 1: Upload the audio file to AssemblyAI
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', buffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization': apiKey
            }
        });

        const uploadUrl = uploadResponse.data.upload_url;

        // Step 2: Submit the transcription request
        const transcriptionResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
            audio_url: uploadUrl,
            language_code: convertLanguageCode(language)
        }, {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }
        });

        const transcriptId = transcriptionResponse.data.id;

        // Step 3: Poll for the transcription result
        let result = { status: 'processing' };
        while (result.status !== 'completed' && result.status !== 'error') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before polling again
            
            const pollingResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: {
                    'Authorization': apiKey
                }
            });
            
            result = pollingResponse.data;
        }

        if (result.status === 'error') {
            throw new Error(`AssemblyAI transcription error: ${result.error}`);
        }

        return result.text || '';
    } catch (error) {
        console.error('Error transcribing audio with AssemblyAI:', error);
        throw error;
    }
}

/**
 * Convert language code to AssemblyAI supported format
 * @param languageCode The language code from the client
 * @returns AssemblyAI compatible language code
 */
function convertLanguageCode(languageCode: string): string {
    // Map of language codes to AssemblyAI supported codes
    const languageMap: Record<string, string> = {
        'en-US': 'en_us',
        'en-GB': 'en_uk',
        'fr-FR': 'fr',
        'es-ES': 'es',
        'de-DE': 'de',
        'it-IT': 'it',
        'pt-BR': 'pt',
        'nl-NL': 'nl',
        'hi-IN': 'hi',
        'ja-JP': 'ja',
        'ko-KR': 'ko',
        'zh-CN': 'zh',
        'vi-VN': 'vi', // Vietnamese
    };

    // Extract the base language code (e.g., 'en' from 'en-US')
    const baseCode = languageCode.split('-')[0].toLowerCase();
    
    // Return the mapped code or fallback to the base code
    return languageMap[languageCode] || languageMap[`${baseCode}-${baseCode.toUpperCase()}`] || baseCode;
}
