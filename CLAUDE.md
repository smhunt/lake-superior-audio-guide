# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive AI-driven audio guide for Lake Superior travel with CarPlay/Android Auto integration. Allows conversational questions about geology, Indigenous history, shipwrecks, and local attractions while driving.

**Repository**: https://github.com/smhunt/lake-superior-audio-guide

**Current Phase**: Phase 1 Complete ✅ - Functional voice assistant deployed

## Development Workflow

**Sean's Workflow Preferences:**
- Check `prompt_plan.md` and `progress.md` before starting any work
- Confirm plan before executing non-trivial changes
- Tests and diagnostics can be run autonomously
- **Ask before**: Schema changes, infrastructure changes, dependency additions

## Common Commands

```bash
# Initial setup (when project is initialized)
npm install
npx pod-install                    # iOS dependencies

# Development
npm start                           # Start Metro bundler
npm run ios                         # Run iOS simulator
npm run android                     # Run Android emulator

# Environment setup
cp .env.example .env                # Create environment file
# Add required keys: ANTHROPIC_API_KEY, STRIPE_PUBLISHABLE_KEY
```

## Technical Stack

```
Frontend:     React Native + TypeScript
Voice:        Whisper (STT) + Edge-TTS/Piper (TTS)
AI:           Claude API with streaming
Database:     SQLite (local) + PostgreSQL (sync server)
Payments:     Stripe
Maps:         MapLibre (offline capable)
CarPlay:      react-native-carplay
Android Auto: Native module wrapper
Hosting:      Railway or Fly.io (API) + Cloudflare R2 (content)
```

## Architecture Overview

### Core Service Layers

**Audio Pipeline**:
- Speech-to-text processing (Whisper API or local whisper.cpp)
- Text-to-speech generation (Edge TTS or local Piper)
- Audio queue management for seamless playback
- Silence detection and interrupt handling

**AI Integration**:
- Claude API conversation context management
- Streaming responses for low-latency
- System prompts injected with Lake Superior knowledge base
- Conversation history with token management

**Location Services**:
- GPS tracking with background capability
- Geofence system for POI (Point of Interest) proximity triggers
- Route detection (Trans-Canada, coastal roads)
- Offline location caching

**Content System**:
- Local SQLite database for offline content
- POI schema: geology, history, Indigenous sites, attractions
- Multi-depth content (Quick/Standard/Deep/Expert)
- Content sync system for updates

### Platform Integration

**CarPlay**: CPTemplate-based interface with voice activation, now-playing audio integration, Siri interrupt handling

**Android Auto**: MediaBrowserService for audio, voice trigger system, message-style conversation UI, Google Assistant coexistence

## Project Structure (Planned)

```
/src
  /app                    # React Native app entry
  /components
    /audio               # Voice input/output components
    /car                 # CarPlay/Android Auto interfaces
    /map                 # MapLibre integration
  /services
    /ai                  # Claude API integration
    /location            # GPS and geofencing
    /content             # POI database and retrieval
    /audio               # Speech processing
  /data
    /poi                 # Points of interest content
    /prompts             # System prompts for Claude
  /hooks                 # Custom React hooks
  /utils                 # Shared utilities
/server
  /api                   # Sync API endpoints
  /admin                 # Partner dashboard
  /content               # Content management
```

## Key Design Principles

**Local-First Architecture**: Maximize offline capability due to cellular coverage gaps on Lake Superior north shore. Core content must work without internet.

**Safety-First UX**: Minimal visual interaction while driving - designed for zero-touch operation via voice.

**Indigenous Content Protocol**:
- No Indigenous content goes live without explicit community partner review
- Revenue sharing from Indigenous content goes to partner communities
- Consent management system required
- Cultural sensitivity filters

**Content Trigger System**:
- Distance-based (10km out, 2km out, at location, passing)
- Time-based (morning route previews, sunset viewpoints)
- Contextual (weather changes, speed variations)

## Content Strategy

**POI Categories** (in priority order):
1. Geological Features - core differentiator
2. Indigenous History & Culture - requires partnership
3. Maritime History & Shipwrecks
4. Provincial/National Parks
5. Towns & Communities
6. Wildlife & Ecology

**Content Depth Levels**:
- Quick: 15-30 seconds
- Standard: 1-2 minutes
- Deep: 3-5 minutes
- Expert: On-demand follow-up questions

**Phase 1 Target**: 50 POIs covering Sault Ste. Marie → Thunder Bay route (Trans-Canada Highway 17)

## Success Criteria

- Sub-2-second response latency in conversation
- 95%+ speech recognition accuracy
- Zero-touch operation while driving
- Core content works offline
- Handles poor cellular gracefully
- Indigenous content has explicit community consent

## Development Environment

- Production-ready, not prototype - include Docker configs
- Tailscale for dev testing across MacBook Pro and Mac mini
- Use `https://dev.ecoworks.ca:<port>` for URLs (SSL cert configured)
- Check `~/.claude/PORTS.md` before assigning ports

## Implementation Phases

See `prompt_plan.md` for detailed phase breakdown:
1. Core Mobile App Foundation (React Native, Audio, Claude API)
2. Location-Aware Intelligence (GPS, POI database, geofencing)
3. CarPlay/Android Auto Integration
4. Content Creation Pipeline (AI generation, Indigenous partnerships)
5. Business Infrastructure (Stripe, analytics, partner dashboard)

## Progress Tracking

Update `progress.md` when completing major milestones or making architectural decisions. Document blockers and questions to resolve.

## License

Proprietary - EcoWorks Web Architecture Inc.
