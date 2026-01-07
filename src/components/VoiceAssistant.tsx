/**
 * Voice Assistant Component
 * Integrated voice pipeline: Record → Whisper STT → Claude AI → TTS
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
  Animated,
} from 'react-native';
import AudioService from '../services/audio/AudioService';
import ClaudeService from '../services/ai/ClaudeService';
import { ConversationMessage } from '../types';

// Initialize services with environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

type AssistantState = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking';

interface ConversationEntry {
  userMessage: string;
  assistantMessage: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const [state, setState] = useState<AssistantState>('idle');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [error, setError] = useState('');
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Services
  const [audioService] = useState(() => new AudioService(OPENAI_API_KEY));
  const [claudeService] = useState(() => new ClaudeService(ANTHROPIC_API_KEY));

  // Animation for recording pulse
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (state === 'recording') {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [state]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.setValue(1);
  };

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

  const checkConfiguration = (): boolean => {
    if (!OPENAI_API_KEY) {
      setError('OpenAI API key not configured. Add OPENAI_API_KEY to .env');
      return false;
    }
    if (!ANTHROPIC_API_KEY) {
      setError('Anthropic API key not configured. Add ANTHROPIC_API_KEY to .env');
      return false;
    }
    if (!permissionsGranted) {
      Alert.alert('Permission Required', 'Please grant microphone permission');
      return false;
    }
    return true;
  };

  const handleVoiceButtonPress = async () => {
    if (state === 'recording') {
      await stopRecordingAndProcess();
    } else if (state === 'idle') {
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (!checkConfiguration()) return;

    setError('');
    setCurrentQuestion('');
    setCurrentResponse('');

    try {
      await audioService.startRecording();
      setState('recording');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setState('idle');
    }
  };

  const stopRecordingAndProcess = async () => {
    try {
      // Stop recording
      setState('transcribing');
      const audioUri = await audioService.stopRecording();

      if (!audioUri) {
        throw new Error('No audio recorded');
      }

      // Transcribe
      const transcription = await audioService.speechToText(audioUri, true);
      setCurrentQuestion(transcription);

      // Get AI response
      setState('thinking');
      let fullResponse = '';

      await claudeService.sendMessageStreaming(transcription, {
        onToken: (token) => {
          fullResponse += token;
          setCurrentResponse(fullResponse);
        },
        onComplete: async (response) => {
          // Speak response
          setState('speaking');
          await audioService.textToSpeech(response);

          // Add to conversation history
          setConversation((prev) => [
            ...prev,
            {
              userMessage: transcription,
              assistantMessage: response,
              timestamp: new Date(),
            },
          ]);

          // Wait for speaking to complete
          const checkSpeaking = setInterval(async () => {
            const speaking = await audioService.isSpeaking();
            if (!speaking) {
              setState('idle');
              clearInterval(checkSpeaking);
            }
          }, 500);
        },
        onError: (err) => {
          setError(err.message);
          setState('idle');
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice processing failed');
      setState('idle');
    }
  };

  const handleStopSpeaking = async () => {
    try {
      await audioService.stopSpeaking();
      setState('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop speaking');
    }
  };

  const handleReset = () => {
    claudeService.resetConversation();
    setConversation([]);
    setCurrentQuestion('');
    setCurrentResponse('');
    setError('');
  };

  const getStateDisplay = (): { text: string; color: string } => {
    switch (state) {
      case 'recording':
        return { text: '🎤 Listening...', color: '#ef4444' };
      case 'transcribing':
        return { text: '📝 Transcribing...', color: '#f59e0b' };
      case 'thinking':
        return { text: '🤔 Thinking...', color: '#3b82f6' };
      case 'speaking':
        return { text: '🔊 Speaking...', color: '#10b981' };
      default:
        return { text: '💬 Tap to ask', color: '#64748b' };
    }
  };

  const stateDisplay = getStateDisplay();
  const isProcessing = state !== 'idle';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎙️ Lake Superior Guide</Text>
          <Text style={styles.subtitle}>Voice Assistant</Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: stateDisplay.color }]}>
            {stateDisplay.text}
          </Text>
        </View>

        {/* Current Interaction */}
        {currentQuestion && (
          <View style={styles.currentSection}>
            <View style={styles.messageCard}>
              <Text style={styles.messageLabel}>You asked:</Text>
              <Text style={styles.messageText}>{currentQuestion}</Text>
            </View>
          </View>
        )}

        {currentResponse && (
          <View style={styles.currentSection}>
            <View style={[styles.messageCard, styles.assistantCard]}>
              <Text style={styles.messageLabel}>Response:</Text>
              <Text style={styles.messageText}>{currentResponse}</Text>
              {state === 'thinking' && <ActivityIndicator color="#3b82f6" style={styles.loader} />}
            </View>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {/* Conversation History */}
        {conversation.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Conversation History</Text>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {conversation.map((entry, index) => (
              <View key={index} style={styles.historyEntry}>
                <View style={styles.historyMessageUser}>
                  <Text style={styles.historyMessageLabel}>You:</Text>
                  <Text style={styles.historyMessageText}>{entry.userMessage}</Text>
                </View>
                <View style={styles.historyMessageAssistant}>
                  <Text style={styles.historyMessageLabel}>Guide:</Text>
                  <Text style={styles.historyMessageText}>{entry.assistantMessage}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        {conversation.length === 0 && !isProcessing && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Try asking:</Text>
            <Text style={styles.instructionItem}>• "Tell me about Sleeping Giant"</Text>
            <Text style={styles.instructionItem}>• "What happened to the Edmund Fitzgerald?"</Text>
            <Text style={styles.instructionItem}>• "Where can I see pictographs?"</Text>
            <Text style={styles.instructionItem}>• "How old is the Canadian Shield?"</Text>
          </View>
        )}
      </ScrollView>

      {/* Voice Button */}
      <View style={styles.voiceButtonContainer}>
        {state === 'speaking' && (
          <TouchableOpacity style={styles.stopButton} onPress={handleStopSpeaking}>
            <Text style={styles.stopButtonText}>⏹️ Stop</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.voiceButton,
            state === 'recording' && styles.voiceButtonRecording,
            isProcessing && state !== 'recording' && styles.voiceButtonProcessing,
          ]}
          onPress={handleVoiceButtonPress}
          disabled={isProcessing && state !== 'recording'}
        >
          <Animated.View style={{ transform: [{ scale: state === 'recording' ? pulseAnim : 1 }] }}>
            {state === 'recording' ? (
              <Text style={styles.voiceButtonIcon}>⏹️</Text>
            ) : isProcessing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.voiceButtonIcon}>🎤</Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  currentSection: {
    marginBottom: 20,
  },
  messageCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  assistantCard: {
    backgroundColor: '#1e3a5f',
    borderColor: '#3b82f6',
  },
  messageLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 24,
  },
  loader: {
    marginTop: 12,
  },
  errorContainer: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  historySection: {
    marginTop: 30,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  resetButton: {
    backgroundColor: '#334155',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  resetButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  historyEntry: {
    marginBottom: 20,
  },
  historyMessageUser: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  historyMessageAssistant: {
    backgroundColor: '#0f1f3a',
    borderRadius: 12,
    padding: 12,
  },
  historyMessageLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '600',
  },
  historyMessageText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  instructionsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 24,
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#475569',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  stopButtonText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonRecording: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  voiceButtonProcessing: {
    backgroundColor: '#475569',
  },
  voiceButtonIcon: {
    fontSize: 36,
  },
});

export default VoiceAssistant;
