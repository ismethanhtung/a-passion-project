# Pronunciation Feature Documentation

This document provides information about the pronunciation feature of the language learning application, including how to set it up, how it works, and how to use it effectively.

## Overview

The pronunciation feature allows users to practice their pronunciation by recording themselves speaking phrases in various languages. The system then analyzes their pronunciation and provides feedback to help them improve.

## How It Works

1. **Speech Recording**: Users can record their voice using the microphone on their device.
2. **Speech-to-Text Conversion**: The recorded audio is converted to text using multiple speech recognition services:
   - Web Speech API (client-side)
   - Vosk (offline speech recognition)
   - AssemblyAI (server-side)
   - Azure Speech Services (server-side)
3. **Pronunciation Analysis**: The transcribed text is compared with the original text to evaluate pronunciation accuracy.
4. **Feedback Generation**: Detailed feedback is provided to help users improve their pronunciation.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser (Chrome, Firefox, Edge, or Safari)

### API Keys

To use the speech-to-text services, you need to obtain API keys:

1. **AssemblyAI**:
   - Sign up at [AssemblyAI](https://www.assemblyai.com/)
   - Get your API key from the dashboard
   - Add it to your `.env` file as `ASSEMBLY_AI_API_KEY`

2. **Azure Speech Services**:
   - Sign up for [Azure](https://azure.microsoft.com/)
   - Create a Speech resource
   - Get your API key and region
   - Add them to your `.env` file as `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`

3. **Groq LLM** (for pronunciation analysis):
   - Sign up at [Groq](https://console.groq.com/)
   - Get your API key
   - Add it to your `.env` file as `GROQ_API_KEY`

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your API keys
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Navigate to the `/pronunciation` page
2. Select a language from the dropdown menu
3. Choose between "Practice Phrases" (pre-defined phrases) or "Free Practice" (custom input)
4. Click the microphone button to start recording
5. Speak the phrase clearly
6. Click the microphone button again to stop recording
7. View the analysis and feedback

## Troubleshooting

### Microphone Access Issues

- Make sure your browser has permission to access your microphone
- Check that your microphone is properly connected and working
- Try using a different browser if you continue to have issues

### Speech Recognition Issues

- Speak clearly and at a moderate pace
- Minimize background noise
- If online services fail, the system will fall back to offline recognition or simulation

### API Key Issues

- Verify that your API keys are correctly entered in the `.env` file
- Check that your API keys are still valid and have not expired
- Ensure you have sufficient quota/credits for the services you're using

## Advanced Features

### Offline Support

The application includes Vosk for offline speech recognition, which works even without an internet connection. This is automatically used as a fallback when online services are unavailable.

### Multiple Languages

The pronunciation feature supports multiple languages, including:
- English (American, British, Australian)
- French
- Spanish
- German
- Japanese
- Chinese (Mandarin)

### Practice History

The application saves your practice history, allowing you to track your progress over time. You can bookmark specific practice sessions for future reference.

## Technical Details

### Speech-to-Text Flow

1. Try Web Speech API (client-side)
2. If that fails, try Vosk (offline)
3. If that fails, try AssemblyAI (server-side)
4. If that fails, try Azure Speech Services (server-side)
5. If all fail, use simulation as a last resort

### Pronunciation Analysis

The system uses a combination of techniques to analyze pronunciation:
- Levenshtein distance to measure similarity between words
- Word-by-word comparison for detailed feedback
- Groq LLM for advanced linguistic analysis

## Contributing

Contributions to improve the pronunciation feature are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
