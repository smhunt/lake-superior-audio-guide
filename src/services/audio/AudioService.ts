/**
 * Audio Service
 * Handles speech-to-text, text-to-speech, and audio playback
 */

import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import WhisperService from './WhisperService';

class AudioService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private whisperService: WhisperService | null = null;

  constructor(openAIApiKey?: string) {
    if (openAIApiKey) {
      this.whisperService = new WhisperService(openAIApiKey);
    }
  }

  /**
   * Request audio permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording and return audio URI
   */
  async stopRecording(): Promise<string | null> {
    if (!this.recording) {
      return null;
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  }

  /**
   * Get recording status
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Convert speech to text using Whisper API
   */
  async speechToText(audioUri: string, useContext: boolean = true): Promise<string> {
    if (!this.whisperService) {
      throw new Error('WhisperService not initialized. Provide OpenAI API key to constructor.');
    }

    const result = useContext
      ? await this.whisperService.transcribeWithContext(audioUri)
      : await this.whisperService.transcribe(audioUri);

    if (result.error) {
      throw new Error(`Transcription failed: ${result.error}`);
    }

    console.log(`Transcription completed in ${result.duration}ms`);
    return result.text;
  }

  /**
   * Record audio and transcribe in one step
   */
  async recordAndTranscribe(): Promise<string> {
    await this.startRecording();

    // Wait for user to stop recording manually
    // In a real implementation, this would be triggered by UI
    return new Promise((resolve, reject) => {
      // This is just a placeholder - actual implementation
      // would be triggered by user stopping recording
      setTimeout(async () => {
        const uri = await this.stopRecording();
        if (uri) {
          try {
            const text = await this.speechToText(uri);
            resolve(text);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('No audio recorded'));
        }
      }, 5000);
    });
  }

  /**
   * Convert text to speech and play
   */
  async textToSpeech(text: string): Promise<void> {
    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9, // Slightly slower for clarity while driving
      });
    } catch (error) {
      console.error('Failed to speak text:', error);
      throw error;
    }
  }

  /**
   * Stop speaking
   */
  async stopSpeaking(): Promise<void> {
    await Speech.stop();
  }

  /**
   * Check if currently speaking
   */
  async isSpeaking(): Promise<boolean> {
    return await Speech.isSpeakingAsync();
  }

  /**
   * Check if Whisper is configured
   */
  isWhisperConfigured(): boolean {
    return this.whisperService?.isConfigured() || false;
  }
}

export default AudioService;
