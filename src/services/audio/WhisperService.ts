/**
 * Whisper Service
 * Handles speech-to-text transcription using OpenAI Whisper API
 */

import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';

interface TranscriptionOptions {
  language?: string; // e.g., 'en' for English
  prompt?: string; // Optional context to improve accuracy
  temperature?: number; // 0-1, controls randomness
}

interface TranscriptionResult {
  text: string;
  duration: number; // Processing time in ms
  error?: string;
}

class WhisperService {
  private client: OpenAI;
  private model = 'whisper-1';

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Transcribe audio file to text
   */
  async transcribe(
    audioUri: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    const startTime = Date.now();

    try {
      // Read the audio file
      const fileInfo = await FileSystem.getInfoAsync(audioUri);

      if (!fileInfo.exists) {
        throw new Error('Audio file does not exist');
      }

      // Read file as base64
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to buffer
      const buffer = Buffer.from(audioBase64, 'base64');

      // Create a File object for the API
      const file = new File([buffer], 'audio.m4a', { type: 'audio/m4a' });

      // Call Whisper API
      const transcription = await this.client.audio.transcriptions.create({
        file: file,
        model: this.model,
        language: options?.language || 'en',
        prompt: options?.prompt,
        temperature: options?.temperature || 0,
      });

      const duration = Date.now() - startTime;

      return {
        text: transcription.text,
        duration,
      };
    } catch (error) {
      console.error('Whisper transcription error:', error);

      const duration = Date.now() - startTime;

      return {
        text: '',
        duration,
        error: error instanceof Error ? error.message : 'Unknown transcription error',
      };
    }
  }

  /**
   * Transcribe with context prompt for better accuracy
   * Useful for Lake Superior-specific terms
   */
  async transcribeWithContext(audioUri: string): Promise<TranscriptionResult> {
    const contextPrompt = `Lake Superior, Ojibwe, Anishinaabe, Canadian Shield,
    Edmund Fitzgerald, Agawa Rock, Sleeping Giant, Thunder Bay, Sault Ste. Marie,
    Pukaskwa, pictographs, Mishipeshu, shipwreck, geology, provincial park`;

    return this.transcribe(audioUri, {
      language: 'en',
      prompt: contextPrompt,
      temperature: 0, // Low temperature for more consistent results
    });
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.client.apiKey;
  }
}

export default WhisperService;
