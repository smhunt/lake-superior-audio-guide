# Lake Superior Audio Guide - Setup Instructions

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `ANTHROPIC_API_KEY` - Get from https://console.anthropic.com
- `STRIPE_PUBLISHABLE_KEY` - Get from https://stripe.com (when implementing payments)

### 3. iOS Setup (macOS only)

```bash
npx pod-install
```

## Running the App

### Start Development Server

```bash
npm start
```

This will open the Expo development tools. From there you can:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your device

### Run on Specific Platform

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing only - main app is mobile)
npm run web
```

## Project Structure

```
/src
  /types              # TypeScript type definitions
  /services
    /ai               # Claude API integration
    /audio            # Speech-to-text, text-to-speech
    /location         # GPS, geofencing, proximity
    /content          # POI database and retrieval
  /components
    /audio            # Audio UI components (planned)
    /car              # CarPlay/Android Auto (planned)
    /map              # Map components (planned)
  /hooks              # Custom React hooks (planned)
  /utils              # Utility functions (planned)
  /data
    /poi              # POI content data (planned)
    /prompts          # Claude system prompts (planned)
```

## Core Services

### ClaudeService
- Manages conversation with Claude AI
- Handles streaming responses
- Injects location context

### LocationService
- GPS tracking with background capability
- Calculates distance to POIs
- Haversine distance formula for accuracy

### AudioService
- Records user voice input
- Converts speech to text (Whisper - TODO)
- Converts text to speech (expo-speech)
- Audio queue management

### ContentService
- Manages POI database
- Retrieves content by depth (Quick/Standard/Deep/Expert)
- Filters by category
- Sample POIs included (Agawa Rock, Sleeping Giant)

## Development Workflow

1. Check `progress.md` for current status
2. Refer to `prompt_plan.md` for phase details
3. Run tests autonomously
4. Ask before: schema changes, infrastructure changes, new dependencies

## Next Steps

See `progress.md` for current phase and next actions.

## Troubleshooting

### Expo not starting
```bash
# Clear cache
npm start -- --clear
```

### iOS build issues
```bash
cd ios
pod install
cd ..
```

### Permission issues
Check that location and microphone permissions are enabled in:
- iOS: Settings > Privacy & Security
- Android: Settings > Apps > Permissions
