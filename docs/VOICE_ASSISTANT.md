# Lake Superior Audio Guide - Voice Assistant

## Overview

The **VoiceAssistant** component is the main interactive interface for the Lake Superior Audio Guide. It integrates the complete audio pipeline into a seamless conversational experience.

## User Flow

```
User taps mic button
    ↓
Records voice question (with visual feedback)
    ↓
Transcribes with Whisper STT (shows "Transcribing...")
    ↓
Sends to Claude AI (shows "Thinking..." + streaming response)
    ↓
Speaks response with TTS (shows "Speaking...")
    ↓
Returns to idle state
```

## Component Architecture

### State Management

**AssistantState**: Tracks the current stage of interaction
- `idle` - Ready for input
- `recording` - Actively recording user voice
- `transcribing` - Converting speech to text
- `thinking` - Waiting for Claude AI response
- `speaking` - Playing TTS audio

### Key Features

1. **One-Tap Voice Interaction**
   - Tap mic button to start recording
   - Tap again to stop and process
   - Automatic progression through pipeline

2. **Real-Time Feedback**
   - Visual status indicators for each stage
   - Pulsing animation during recording
   - Streaming response display as Claude responds
   - Color-coded states

3. **Conversation History**
   - Maintains full conversation context
   - Displays previous Q&A pairs
   - Reset button to clear history
   - Claude retains context across questions

4. **Error Handling**
   - Permission checks
   - API key validation
   - Network error recovery
   - User-friendly error messages

5. **Audio Controls**
   - Stop speaking button during TTS playback
   - Cannot interrupt while processing
   - Automatic cleanup after completion

## Usage

### Basic Implementation

```typescript
import VoiceAssistant from './src/components/VoiceAssistant';

export default function App() {
  return <VoiceAssistant />;
}
```

### Configuration

Requires environment variables in `.env`:

```bash
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Permissions

The component automatically requests:
- **Microphone permission** - For audio recording
- Checks on mount and displays status

## UI Components

### Main Voice Button
- **Idle**: Blue mic icon
- **Recording**: Red pulsing square (stop) icon
- **Processing**: Gray with loading spinner
- **Size**: 80x80 circular button
- **Position**: Fixed at bottom center

### Status Display
- Color-coded text indicating current state
- Positioned below header
- Updates in real-time

### Message Cards
- **User Messages**: Dark blue background
- **Assistant Messages**: Lighter blue with border
- **Current Messages**: Larger, prominent cards
- **History Messages**: Compact historical view

### Conversation History
- Collapsible section
- Shows all previous interactions
- Reset button to clear
- Scrollable list

## State Transitions

```
idle → [user taps] → recording
recording → [user taps] → transcribing
transcribing → [Whisper complete] → thinking
thinking → [Claude response] → speaking
speaking → [TTS complete] → idle

speaking → [user stops] → idle
error at any stage → idle
```

## Error Scenarios

### Permission Denied
```
Error: "Microphone permissions required"
Action: Prompt user to grant permissions in settings
```

### Missing API Keys
```
Error: "OpenAI API key not configured"
Error: "Anthropic API key not configured"
Action: User must add keys to .env file
```

### Network Errors
```
Error: "Transcription failed: [reason]"
Error: "Voice processing failed"
Action: Display error, return to idle, user can retry
```

### Recording Errors
```
Error: "No audio recorded"
Action: Return to idle, user can retry
```

## Example Interactions

### Example 1: Simple Question
```
User: [Taps mic] "Tell me about Sleeping Giant"
Assistant: [Thinking...] "The Sleeping Giant is a mesa over 240 meters
high formed from ancient volcanic sills. In Ojibwe legend, it's the
warrior Nanabijou, turned to stone while protecting the secret location
of a silver mine."
```

### Example 2: Follow-Up Question
```
User: "How was it formed?"
Assistant: "The formation is part of the Logan Sills, diabase intrusions
from 1.1 billion years ago. These igneous rocks were pushed up between
existing rock layers, creating the distinctive cliff faces you see today."
```

### Example 3: Location-Specific
```
[When near Agawa Rock - location context injected]
User: "What am I looking at?"
Assistant: "You're at Agawa Rock, home to sacred Ojibwe pictographs
painted centuries ago. The red ochre images on this ancient Canadian
Shield include Mishipeshu, the great water lynx who controls the lake."
```

## Integration with Other Services

### AudioService
```typescript
// Initialized with OpenAI API key
const audioService = new AudioService(OPENAI_API_KEY);

// Used for:
await audioService.startRecording();
const uri = await audioService.stopRecording();
const text = await audioService.speechToText(uri, true);
await audioService.textToSpeech(response);
```

### ClaudeService
```typescript
// Initialized with Anthropic API key
const claudeService = new ClaudeService(ANTHROPIC_API_KEY);

// Used for:
await claudeService.sendMessageStreaming(question, {
  onToken: (token) => appendToResponse(token),
  onComplete: (response) => speakResponse(response),
  onError: (err) => showError(err)
});
```

## Performance Characteristics

### Latency Breakdown
- **Recording start**: ~200ms
- **Transcription (Whisper)**: 2-5 seconds (depends on audio length)
- **Claude first token**: 1-2 seconds
- **Claude full response**: 3-8 seconds (depends on response length)
- **TTS start**: Immediate
- **Total user-to-response**: 6-15 seconds

### Optimization Strategies
1. **Streaming responses**: Show tokens as they arrive
2. **Visual feedback**: Keep user informed at each stage
3. **Context prompts**: Improve Whisper accuracy for domain terms
4. **Token management**: Trim conversation history to reduce Claude latency

## Accessibility

- **Visual Indicators**: Clear status for each stage
- **Color Coding**: Distinct colors for each state
- **Large Touch Target**: 80x80 button easy to tap while driving
- **Error Messages**: Clear, actionable feedback
- **Stop Control**: Ability to interrupt TTS playback

## Future Enhancements

### Planned Features
1. **Voice Activation**: "Hey Superior" wake word
2. **Location Context**: Automatic POI injection based on GPS
3. **Offline Mode**: Cached responses for common questions
4. **CarPlay Integration**: Native vehicle display
5. **Conversation Export**: Save interesting exchanges
6. **Custom Voice**: Different TTS voices/speeds

### Potential Improvements
- Noise cancellation for in-vehicle recording
- Background noise detection
- Multi-language support
- Reduced latency with local models
- Voice activity detection (auto-stop recording)

## Testing

### Manual Testing Checklist
- [ ] Tap mic button starts recording
- [ ] Recording shows pulsing animation
- [ ] Tap again stops and transcribes
- [ ] Transcription appears accurately
- [ ] Claude response streams in real-time
- [ ] TTS plays response
- [ ] Conversation history updates
- [ ] Reset clears history
- [ ] Error messages display correctly
- [ ] Stop speaking works during TTS

### Test Questions
```
"Tell me about the Canadian Shield"
"What shipwrecks are near here?"
"Where can I see wildlife?"
"Tell me about Ojibwe history"
"What's the weather like on Lake Superior?"
```

### Edge Cases
- Empty recording (no speech)
- Very short recording (<1 second)
- Very long recording (>30 seconds)
- Network interruption during processing
- Rapid repeated taps
- Permission denied scenarios

## Troubleshooting

### "No microphone permission"
**Solution**: Open Settings → App → Permissions → Enable Microphone

### "API key not configured"
**Solution**: Add keys to `.env` file, restart app

### "Transcription failed"
**Causes**:
- No internet connection
- Invalid API key
- Audio file too short/corrupt
**Solution**: Check network, verify API keys, try recording again

### "Voice processing failed"
**Causes**: Generic error in pipeline
**Solution**: Check error details, verify all services initialized

### Recording doesn't stop
**Cause**: UI freeze or crash
**Solution**: Force restart app

## File Structure

```
src/
  components/
    VoiceAssistant.tsx          # Main voice assistant component
  services/
    audio/
      AudioService.ts            # Recording, STT, TTS
      WhisperService.ts          # Whisper API integration
    ai/
      ClaudeService.ts           # Claude AI integration
  types/
    index.ts                     # TypeScript type definitions
App.tsx                          # App entry point
```

## Dependencies

- `expo-av` - Audio recording
- `expo-speech` - Text-to-speech
- `openai` - Whisper STT
- `@anthropic-ai/sdk` - Claude AI
- `react-native` - UI framework

## Related Documentation

- [AUDIO_PIPELINE.md](./AUDIO_PIPELINE.md) - Detailed pipeline docs
- [SETUP.md](../SETUP.md) - Project setup instructions
- [CLAUDE.md](../CLAUDE.md) - Project overview
- [progress.md](../progress.md) - Current status
