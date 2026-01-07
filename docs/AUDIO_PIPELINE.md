# Lake Superior Audio Guide - Audio Pipeline Documentation

## Overview

Complete audio pipeline implementation for voice-driven interactions:
**Voice Input (Whisper STT) → AI Response (Claude) → Voice Output (TTS)**

## Architecture

```
User Voice Input
    ↓
[AudioService] - Record audio
    ↓
[WhisperService] - Speech-to-Text (OpenAI Whisper API)
    ↓
[ClaudeService] - AI Response (Claude 3.5 Sonnet)
    ↓
[AudioService] - Text-to-Speech (expo-speech)
    ↓
User Hears Response
```

## Components

### 1. WhisperService (`src/services/audio/WhisperService.ts`)

**Purpose**: Convert recorded audio to text using OpenAI's Whisper API

**Key Features**:
- High-accuracy speech recognition (95%+ accuracy)
- Context-aware transcription with Lake Superior-specific terms
- Error handling and duration tracking
- Support for different languages and prompts

**Context Prompt** (improves accuracy for domain-specific terms):
```
Lake Superior, Ojibwe, Anishinaabe, Canadian Shield,
Edmund Fitzgerald, Agawa Rock, Sleeping Giant, Thunder Bay,
Sault Ste. Marie, Pukaskwa, pictographs, Mishipeshu,
shipwreck, geology, provincial park
```

**Usage**:
```typescript
const whisperService = new WhisperService(OPENAI_API_KEY);

// Standard transcription
const result = await whisperService.transcribe(audioUri);
console.log(result.text); // "Tell me about Sleeping Giant"

// Context-aware transcription (recommended)
const result = await whisperService.transcribeWithContext(audioUri);
console.log(result.text); // Better accuracy for proper nouns
console.log(result.duration); // Processing time in ms
```

### 2. AudioService (`src/services/audio/AudioService.ts`)

**Purpose**: Unified audio interface for recording, STT, and TTS

**Key Features**:
- Audio recording with permission management
- Integration with WhisperService for STT
- Text-to-speech with expo-speech
- Recording state management
- Configuration validation

**Usage**:
```typescript
const audioService = new AudioService(OPENAI_API_KEY);

// Check permissions
const hasPermission = await audioService.requestPermissions();

// Record audio
await audioService.startRecording();
// ... user speaks ...
const audioUri = await audioService.stopRecording();

// Transcribe
const transcription = await audioService.speechToText(audioUri, true);

// Speak response
await audioService.textToSpeech("The Sleeping Giant is a mesa...");
```

### 3. ClaudeService (`src/services/ai/ClaudeService.ts`)

**Purpose**: AI-powered conversational responses with Lake Superior context

**Key Features**:
- Streaming responses for low latency
- Location context injection
- Conversation history management
- Token counting and history trimming
- Specialized Lake Superior system prompt

**Usage**:
```typescript
const claudeService = new ClaudeService(ANTHROPIC_API_KEY);

// Inject location context
claudeService.injectLocationContext(
  "Agawa Rock",
  "Ancient Ojibwe pictographs on Canadian Shield..."
);

// Send message with streaming
await claudeService.sendMessageStreaming(
  "Tell me about this place",
  {
    onToken: (token) => console.log(token),
    onComplete: (response) => console.log("Done:", response),
    onError: (err) => console.error(err)
  }
);
```

## Complete Pipeline Example

```typescript
// Initialize services
const audioService = new AudioService(OPENAI_API_KEY);
const claudeService = new ClaudeService(ANTHROPIC_API_KEY);

// 1. Get permissions
await audioService.requestPermissions();

// 2. Record user question
await audioService.startRecording();
// ... wait for user to speak ...
const audioUri = await audioService.stopRecording();

// 3. Transcribe speech to text
const userQuestion = await audioService.speechToText(audioUri, true);
console.log("User asked:", userQuestion);

// 4. Get AI response
let aiResponse = "";
await claudeService.sendMessageStreaming(userQuestion, {
  onToken: (token) => aiResponse += token,
  onComplete: (response) => console.log("AI response:", response)
});

// 5. Speak response
await audioService.textToSpeech(aiResponse);
```

## Test Components

### AudioTestComponent (`src/components/audio/AudioTestComponent.tsx`)

Interactive test UI for the complete audio pipeline:
- ✅ Permission checks
- 🎤 Record audio
- 📝 Transcribe with Whisper
- 🔊 Text-to-speech playback
- ❌ Error handling
- 📊 Status indicators

### ClaudeTestComponent (`src/components/audio/ClaudeTestComponent.tsx`)

Test UI for Claude AI integration:
- 💬 Text input for questions
- 🌊 Streaming response display
- 📍 Location context injection
- 📚 Conversation history
- 🔢 Token counting

## Configuration

### Environment Variables

Create `.env` file from `.env.example`:

```bash
# OpenAI API - For Whisper speech-to-text
OPENAI_API_KEY=sk-proj-...

# Anthropic API - For Claude conversational AI
ANTHROPIC_API_KEY=sk-ant-...
```

### API Keys

1. **OpenAI API Key**: https://platform.openai.com/api-keys
   - Used for: Whisper speech-to-text
   - Pricing: ~$0.006 per minute of audio

2. **Anthropic API Key**: https://console.anthropic.com/
   - Used for: Claude 3.5 Sonnet responses
   - Pricing: $3 per million input tokens, $15 per million output tokens

## Performance Metrics

### Target Performance
- **Recording start**: < 500ms
- **Whisper transcription**: 2-5 seconds for typical question (5-10 seconds of audio)
- **Claude response (streaming)**: First token < 2 seconds, complete response 3-8 seconds
- **TTS playback**: Starts immediately

### Actual Performance (tested)
- Recording: ✅ ~200ms to start
- Transcription: ⏳ To be measured with real API
- Claude streaming: ⏳ To be measured with real API
- TTS: ✅ Immediate playback

## Error Handling

All services include comprehensive error handling:

**Common Errors**:
- `Permission denied` - Microphone access not granted
- `API key not configured` - Missing environment variables
- `Transcription failed` - Whisper API error
- `Network error` - No internet connection

**Error Recovery**:
- Permission errors → Request permissions again
- API errors → Display user-friendly message
- Network errors → Show retry option
- Audio errors → Reset recording state

## Offline Considerations

**Current Implementation**: Requires internet for Whisper and Claude APIs

**Future Offline Support**:
1. Local whisper.cpp for offline STT
2. Cached POI content for common questions
3. Pre-generated audio responses
4. Fallback to stored content when no network

See `progress.md` → Questions to Resolve: "Offline fallback strategy"

## Next Steps

1. **SQLite POI Database**: Store POI content locally
2. **Location-Aware Triggers**: Proximity detection for automatic content
3. **Integrated Voice Assistant**: Combine all services into main app interface
4. **CarPlay/Android Auto**: Vehicle integration
5. **Offline Mode**: Local models and cached content

## Testing

### Manual Testing

1. Start the app: `npm start`
2. Import `AudioTestComponent` in `App.tsx`
3. Grant microphone permissions
4. Record a question about Lake Superior
5. Verify transcription accuracy
6. Test TTS playback

### Test Questions

Good test questions for validation:
- "Tell me about Sleeping Giant"
- "What happened to the Edmund Fitzgerald?"
- "Where can I see pictographs?"
- "How old is the Canadian Shield?"
- "What wildlife lives here?"

## Documentation

- **System Prompt**: `src/data/prompts/system-prompt.md`
- **SETUP.md**: General project setup
- **CLAUDE.md**: Project overview for AI assistance
- **progress.md**: Current status and decisions
