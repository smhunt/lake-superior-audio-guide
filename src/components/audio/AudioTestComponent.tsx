/**
 * Audio Test Component
 * Test recording, transcription (Whisper), and text-to-speech
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AudioService from '../../services/audio/AudioService';

// Initialize with environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const AudioTestComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [audioService] = useState(() => new AudioService(OPENAI_API_KEY));
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await audioService.requestPermissions();
      setPermissionsGranted(granted);
      if (!granted) {
        setError('Microphone permissions required');
      }
    } catch (err) {
      setError('Failed to request permissions');
    }
  };

  const handleStartRecording = async () => {
    if (!permissionsGranted) {
      Alert.alert('Permission Required', 'Please grant microphone permission');
      return;
    }

    if (!OPENAI_API_KEY) {
      setError('OpenAI API key not configured. Add OPENAI_API_KEY to .env');
      return;
    }

    setError('');
    setTranscription('');
    setAudioUri(null);

    try {
      await audioService.startRecording();
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      const uri = await audioService.stopRecording();
      setIsRecording(false);

      if (uri) {
        setAudioUri(uri);
        console.log('Recording saved to:', uri);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop recording');
      setIsRecording(false);
    }
  };

  const handleTranscribe = async () => {
    if (!audioUri) {
      setError('No audio to transcribe');
      return;
    }

    setIsTranscribing(true);
    setError('');

    try {
      const text = await audioService.speechToText(audioUri, true);
      setTranscription(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transcription failed');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSpeak = async () => {
    if (!transcription) {
      setError('No text to speak');
      return;
    }

    setIsSpeaking(true);
    setError('');

    try {
      await audioService.textToSpeech(transcription);

      // Check speaking status periodically
      const checkSpeaking = setInterval(async () => {
        const speaking = await audioService.isSpeaking();
        if (!speaking) {
          setIsSpeaking(false);
          clearInterval(checkSpeaking);
        }
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Text-to-speech failed');
      setIsSpeaking(false);
    }
  };

  const handleStopSpeaking = async () => {
    try {
      await audioService.stopSpeaking();
      setIsSpeaking(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop speaking');
    }
  };

  const handleReset = () => {
    setTranscription('');
    setAudioUri(null);
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎤 Audio Pipeline Test</Text>
        <Text style={styles.subtitle}>Record → Whisper STT → TTS</Text>
      </View>

      {/* Permissions Status */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Permissions: {permissionsGranted ? '✅ Granted' : '❌ Not Granted'}
        </Text>
        <Text style={styles.label}>
          Whisper: {audioService.isWhisperConfigured() ? '✅ Configured' : '❌ Not Configured'}
        </Text>
      </View>

      {/* Recording Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Record Audio</Text>
        {!isRecording ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartRecording}
            disabled={!permissionsGranted}
          >
            <Text style={styles.buttonText}>🎤 Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonRecording} onPress={handleStopRecording}>
            <Text style={styles.buttonText}>⏹️ Stop Recording</Text>
          </TouchableOpacity>
        )}

        {audioUri && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>✅ Recording saved</Text>
          </View>
        )}
      </View>

      {/* Transcription Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Transcribe (Whisper)</Text>
        <TouchableOpacity
          style={[styles.button, (!audioUri || isTranscribing) && styles.buttonDisabled]}
          onPress={handleTranscribe}
          disabled={!audioUri || isTranscribing}
        >
          {isTranscribing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📝 Transcribe Audio</Text>
          )}
        </TouchableOpacity>

        {transcription && (
          <View style={styles.responseBox}>
            <Text style={styles.label}>Transcription:</Text>
            <Text style={styles.responseText}>{transcription}</Text>
          </View>
        )}
      </View>

      {/* Text-to-Speech Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Text-to-Speech</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, !transcription && styles.buttonDisabled]}
            onPress={handleSpeak}
            disabled={!transcription || isSpeaking}
          >
            <Text style={styles.buttonText}>🔊 Speak</Text>
          </TouchableOpacity>

          {isSpeaking && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleStopSpeaking}>
              <Text style={styles.secondaryButtonText}>⏹️ Stop</Text>
            </TouchableOpacity>
          )}
        </View>

        {isSpeaking && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>🔊 Speaking...</Text>
          </View>
        )}
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.section}>
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        </View>
      )}

      {/* Reset Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset All</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.instructions}>
          💡 Full Pipeline Test:{'\n'}
          1. Record your question about Lake Superior{'\n'}
          2. Transcribe using Whisper API{'\n'}
          3. Hear it played back with TTS{'\n\n'}
          Example: "Tell me about Sleeping Giant"
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonRecording: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#475569',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#475569',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  resetButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  responseBox: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 12,
  },
  responseText: {
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
  },
  successBox: {
    backgroundColor: '#064e3b',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#059669',
  },
  successText: {
    color: '#6ee7b7',
    fontSize: 14,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  instructions: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default AudioTestComponent;
