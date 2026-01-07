/**
 * Audio Service
 * Handles speech-to-text, text-to-speech, and audio playback
 */

import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

class AudioService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

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
   * Convert speech to text using Whisper API
   * TODO: Implement Whisper API or local whisper.cpp
   */
  async speechToText(audioUri: string): Promise<string> {
    // Placeholder - will implement Whisper API
    console.log('Converting speech to text:', audioUri);
    return 'Transcribed text placeholder';
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
}

export default AudioService;
