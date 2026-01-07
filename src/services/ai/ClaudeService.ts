/**
 * Claude API Integration Service
 * Handles conversation with Claude AI for audio guide responses
 */

import Anthropic from '@anthropic-ai/sdk';
import { ConversationMessage } from '../../types';

interface StreamCallback {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

class ClaudeService {
  private client: Anthropic;
  private conversationHistory: ConversationMessage[] = [];
  private locationContext: string = '';
  private maxTokens = 1024;
  private model = 'claude-3-5-sonnet-20241022';

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  /**
   * Get system prompt with Lake Superior context
   */
  private getSystemPrompt(): string {
    const basePrompt = `You are an AI audio guide for Lake Superior, the world's largest freshwater lake. Your role is to provide engaging, accurate information about:

- Geological features and the 2.7 billion year old Canadian Shield
- Indigenous (Ojibwe) history, culture, and sacred sites
- Maritime history including shipwrecks like the Edmund Fitzgerald
- Provincial and National Parks along the lake
- Towns, communities, and local culture
- Wildlife and ecology of the boreal forest and lake ecosystem

Keep responses conversational and concise (2-3 sentences typically) since they'll be spoken aloud while driving. Use storytelling to make facts memorable. Connect different topics naturally (e.g., geology to Indigenous history, shipwrecks to weather patterns).

Always be respectful when discussing Indigenous content - these are living cultures, not museum exhibits.`;

    if (this.locationContext) {
      return `${basePrompt}\n\nCurrent Location Context:\n${this.locationContext}`;
    }

    return basePrompt;
  }

  /**
   * Send a message to Claude with streaming response
   */
  async sendMessageStreaming(
    userMessage: string,
    callbacks?: StreamCallback
  ): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      });

      // Convert history to Anthropic format (exclude system messages)
      const messages = this.conversationHistory
        .filter((msg) => msg.role !== 'system')
        .map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

      let fullResponse = '';

      // Create streaming request
      const stream = await this.client.messages.stream({
        model: this.model,
        max_tokens: this.maxTokens,
        system: this.getSystemPrompt(),
        messages: messages,
      });

      // Handle streaming tokens
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const token = event.delta.text;
          fullResponse += token;

          // Call token callback if provided
          if (callbacks?.onToken) {
            callbacks.onToken(token);
          }
        }
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      });

      // Call completion callback if provided
      if (callbacks?.onComplete) {
        callbacks.onComplete(fullResponse);
      }

      return fullResponse;
    } catch (error) {
      console.error('Claude API error:', error);
      if (callbacks?.onError) {
        callbacks.onError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Send a message without streaming (simpler for some use cases)
   */
  async sendMessage(userMessage: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.sendMessageStreaming(userMessage, {
        onComplete: resolve,
        onError: reject,
      });
    });
  }

  /**
   * Inject location context into the system prompt
   */
  injectLocationContext(poiName: string, poiContent: string): void {
    this.locationContext = `You are currently near ${poiName}. ${poiContent}

The user may ask questions about this location. Provide relevant, engaging information.`;

    // Also add to conversation history for context
    this.conversationHistory.push({
      role: 'system',
      content: this.locationContext,
      timestamp: new Date(),
    });
  }

  /**
   * Clear location context
   */
  clearLocationContext(): void {
    this.locationContext = '';
  }

  /**
   * Clear conversation history
   */
  resetConversation(): void {
    this.conversationHistory = [];
    this.locationContext = '';
  }

  /**
   * Get conversation history
   */
  getHistory(): ConversationMessage[] {
    return this.conversationHistory;
  }

  /**
   * Set max tokens for responses
   */
  setMaxTokens(tokens: number): void {
    this.maxTokens = tokens;
  }

  /**
   * Get conversation token count estimate
   */
  getEstimatedTokenCount(): number {
    // Rough estimate: ~4 characters per token
    const totalChars = this.conversationHistory.reduce(
      (sum, msg) => sum + msg.content.length,
      0
    );
    return Math.ceil(totalChars / 4);
  }

  /**
   * Trim conversation history if getting too long
   */
  trimHistory(maxMessages: number = 20): void {
    if (this.conversationHistory.length > maxMessages) {
      // Keep system messages and most recent exchanges
      const systemMessages = this.conversationHistory.filter(
        (msg) => msg.role === 'system'
      );
      const recentMessages = this.conversationHistory
        .filter((msg) => msg.role !== 'system')
        .slice(-maxMessages);
      this.conversationHistory = [...systemMessages, ...recentMessages];
    }
  }
}

export default ClaudeService;
