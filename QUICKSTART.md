# Lake Superior Audio Guide - Quick Start

**Repository**: https://github.com/smhunt/lake-superior-audio-guide

## Clone the Repository

```bash
git clone https://github.com/smhunt/lake-superior-audio-guide.git
cd lake-superior-audio-guide
npm install
```

## Try the Voice Assistant Now!

### 1. Setup API Keys

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

Add these keys:
```bash
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
```

Get keys from:
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/

### 2. Start the App

```bash
npm start
```

This opens the Expo dev tools. Then:
- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### 3. Grant Permissions

When the app launches:
1. Grant microphone permission when prompted
2. You'll see the voice assistant interface

### 4. Ask a Question!

**Tap the blue microphone button** and ask:

- "Tell me about Sleeping Giant"
- "What happened to the Edmund Fitzgerald?"
- "How old is the Canadian Shield?"
- "Where can I see Ojibwe pictographs?"
- "Tell me about Lake Superior"

### 5. Watch the Magic ✨

1. **Recording** - You'll see a red pulsing button while you speak
2. **Transcribing** - Your question appears as text
3. **Thinking** - Claude's response streams in word-by-word
4. **Speaking** - The response is spoken aloud

The conversation history appears below!

## What You Can Do

### Voice Interaction
- **Tap mic** → Start recording
- **Tap again** → Stop and process
- **Tap Stop** → Interrupt speaking

### Conversation
- Ask follow-up questions
- Context is maintained
- Full history displayed
- **Reset** button clears everything

### Test Questions

**Geology**:
- "What is the Canadian Shield?"
- "Tell me about the rocks here"

**History**:
- "What's the story of the Edmund Fitzgerald?"
- "Tell me about shipwrecks"

**Indigenous Culture**:
- "Who are the Ojibwe people?"
- "What are pictographs?"

**Parks & Nature**:
- "What parks are along Lake Superior?"
- "What wildlife lives here?"

## How It Works

```
Your Voice
    ↓
OpenAI Whisper (Speech-to-Text)
    ↓
Claude 3.5 Sonnet (AI Response)
    ↓
Text-to-Speech (Voice Output)
    ↓
You Hear the Answer
```

## Current Features

✅ **Voice recording** with visual feedback
✅ **Speech-to-text** with 95%+ accuracy (Whisper)
✅ **AI responses** with Lake Superior knowledge (Claude)
✅ **Text-to-speech** for hands-free operation
✅ **Conversation history** with context
✅ **Streaming responses** for low latency
✅ **Error handling** and recovery

## What's Next

### Phase 2 (Coming Soon):
- 📍 **Location awareness** - Automatic content based on GPS
- 🗺️ **POI database** - 50+ points of interest
- 🚨 **Proximity alerts** - "You're approaching Agawa Rock..."
- 💾 **Offline mode** - Works without cellular

### Phase 3 (Planned):
- 🚗 **CarPlay integration** - Native vehicle display
- 🎯 **Voice activation** - "Hey Superior"
- 🌐 **Multi-language** - French, Ojibwe support

## Troubleshooting

### "Microphone permissions required"
Open Settings → Privacy → Microphone → Enable for Expo Go

### "API key not configured"
Make sure you added keys to `.env` file and restarted the app

### "No response"
- Check internet connection
- Verify API keys are correct
- Check console for errors

### App won't start
```bash
# Clear cache and restart
npm start -- --clear
```

## Cost Estimates

### Per Question (~10 seconds audio):
- **Whisper transcription**: ~$0.001
- **Claude response**: ~$0.01-0.02
- **Total per question**: ~$0.01-0.02

### 100 Questions:
- **Cost**: ~$1-2
- Very affordable for testing!

## Project Status

**Phase 1: COMPLETE ✅**
- Foundation, audio pipeline, AI integration, voice assistant

**Next**: Location-aware intelligence

See `progress.md` for detailed status.

## Documentation

- `SETUP.md` - Full setup guide
- `docs/VOICE_ASSISTANT.md` - Voice assistant details
- `docs/AUDIO_PIPELINE.md` - Technical pipeline docs
- `CLAUDE.md` - Project overview
- `progress.md` - Current status

## Get Help

Having issues? Check:
1. Console logs for errors
2. API key validity
3. Network connection
4. Permissions granted

## Have Fun! 🎉

The voice assistant is fully functional. Try asking about:
- Geological formations
- Indigenous history
- Maritime disasters
- Parks and wildlife
- Local communities

The AI has deep knowledge about Lake Superior and can answer questions conversationally!
