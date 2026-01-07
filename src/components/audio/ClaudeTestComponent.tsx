/**
 * Claude Test Component
 * Simple UI to test Claude API streaming integration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ClaudeService from '../../services/ai/ClaudeService';

// Initialize with environment variable
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const ClaudeTestComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [claudeService] = useState(() => new ClaudeService(ANTHROPIC_API_KEY));

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!ANTHROPIC_API_KEY) {
      setError('API key not configured. Add ANTHROPIC_API_KEY to .env');
      return;
    }

    setIsStreaming(true);
    setResponse('');
    setError('');

    try {
      await claudeService.sendMessageStreaming(input, {
        onToken: (token) => {
          setResponse((prev) => prev + token);
        },
        onComplete: (fullResponse) => {
          console.log('Streaming complete:', fullResponse);
          setIsStreaming(false);
        },
        onError: (err) => {
          setError(err.message);
          setIsStreaming(false);
        },
      });

      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsStreaming(false);
    }
  };

  const handleTestLocation = () => {
    claudeService.injectLocationContext(
      'Agawa Rock',
      'Ancient Ojibwe pictographs painted on the 2.7 billion year old Canadian Shield. Features sacred images including the great water lynx Mishipeshu.'
    );
    setInput('Tell me about this place');
  };

  const handleReset = () => {
    claudeService.resetConversation();
    setResponse('');
    setError('');
    setInput('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Claude API Test</Text>
        <Text style={styles.subtitle}>Stream responses from Claude 3.5 Sonnet</Text>
      </View>

      {/* Test Location Context */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleTestLocation}>
          <Text style={styles.secondaryButtonText}>
            📍 Test Location Context (Agawa Rock)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Section */}
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="Ask about Lake Superior..."
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
          multiline
          editable={!isStreaming}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, isStreaming && styles.buttonDisabled]}
            onPress={handleSendMessage}
            disabled={isStreaming || !input.trim()}
          >
            {isStreaming ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Response Section */}
      {response && (
        <View style={styles.section}>
          <Text style={styles.label}>Response:</Text>
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        </View>
      )}

      {/* Error Section */}
      {error && (
        <View style={styles.section}>
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        </View>
      )}

      {/* Conversation History */}
      <View style={styles.section}>
        <Text style={styles.label}>
          History: {claudeService.getHistory().length} messages
        </Text>
        <Text style={styles.label}>
          Estimated tokens: {claudeService.getEstimatedTokenCount()}
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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
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
  resetButton: {
    backgroundColor: '#475569',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  responseBox: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  responseText: {
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
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
});

export default ClaudeTestComponent;
