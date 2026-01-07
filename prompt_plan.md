# Lake Superior AI Audio Guide - Claude Code Implementation Plan

## Project Overview
Interactive AI-driven audio guide for Lake Superior travel with CarPlay/Android Auto integration. Allows conversational questions about geology, Indigenous history, shipwrecks, and local attractions.

## Phase 1: Core Mobile App Foundation (Week 1-2)

### 1.1 React Native Project Setup
- [ ] Initialize React Native project with TypeScript
- [ ] Configure react-native-carplay and Android Auto SDK
- [ ] Set up Expo for easier development iteration
- [ ] Configure Tailscale-compatible development environment

### 1.2 Audio Infrastructure
- [ ] Implement speech-to-text (Whisper API or local whisper.cpp)
- [ ] Implement text-to-speech (Edge TTS or local Piper)
- [ ] Create audio queue manager for seamless playback
- [ ] Build silence detection and interrupt handling

### 1.3 Claude API Integration
- [ ] Create conversation context manager
- [ ] Build system prompt with Lake Superior knowledge base
- [ ] Implement streaming responses for low-latency feel
- [ ] Add conversation history with token management

## Phase 2: Location-Aware Intelligence (Week 3-4)

### 2.1 Geolocation System
- [ ] Implement GPS tracking with background capability
- [ ] Build geofence system for POI proximity triggers
- [ ] Create route detection (Trans-Canada, coastal roads)
- [ ] Add offline location caching

### 2.2 Points of Interest Database
- [ ] Design POI schema (geology, history, Indigenous sites, attractions)
- [ ] Build initial Ontario north shore POI dataset
- [ ] Implement POI-to-context injection for Claude
- [ ] Create proactive notification system ("You're approaching...")

### 2.3 Content Retrieval
- [ ] Build local SQLite database for offline content
- [ ] Create content sync system for updates
- [ ] Implement search/filter by category, distance, relevance

## Phase 3: CarPlay/Android Auto Integration (Week 5-6)

### 3.1 CarPlay Implementation
- [ ] Build CPTemplate-based interface
- [ ] Implement voice activation ("Hey Superior")
- [ ] Create now-playing audio integration
- [ ] Handle Siri interrupts gracefully

### 3.2 Android Auto Implementation
- [ ] Build MediaBrowserService for audio
- [ ] Implement voice trigger system
- [ ] Create message-style conversation UI
- [ ] Handle Google Assistant coexistence

### 3.3 Unified Experience
- [ ] Create shared conversation state between phone/car
- [ ] Build handoff when entering/leaving vehicle
- [ ] Implement safety-first UX (minimal visual interaction while driving)

## Phase 4: Content Creation Pipeline (Week 7-8)

### 4.1 AI Content Generation
- [ ] Build Claude-powered content generator for POIs
- [ ] Create fact-checking workflow against sources
- [ ] Implement tone/style consistency system
- [ ] Generate multi-depth content (quick/medium/deep)

### 4.2 Indigenous Content Partnership Framework
- [ ] Build consent management system for Indigenous stories
- [ ] Create attribution and revenue sharing tracking
- [ ] Implement community review workflow
- [ ] Design cultural sensitivity filters

### 4.3 Seasonal/Dynamic Content
- [ ] Build event calendar integration
- [ ] Create weather-aware content suggestions
- [ ] Implement seasonal variation (fall colors, ice formations, etc.)

## Phase 5: Business Infrastructure (Week 9-10)

### 5.1 Subscription System
- [ ] Integrate Stripe for payments
- [ ] Build tier management (Free/Explorer/Circle Superior)
- [ ] Create trial and upgrade flows
- [ ] Implement offline grace period handling

### 5.2 Analytics & Feedback
- [ ] Build usage analytics (popular POIs, common questions)
- [ ] Create feedback collection system
- [ ] Implement content improvement pipeline
- [ ] Track partnership attribution

### 5.3 Partner Dashboard
- [ ] Build white-label configuration system
- [ ] Create partner analytics views
- [ ] Implement revenue sharing calculations
- [ ] Design partnership onboarding flow

## Technical Stack

```
Frontend: React Native + TypeScript
Voice: Whisper (STT) + Edge-TTS/Piper (TTS)
AI: Claude API with streaming
Database: SQLite (local) + PostgreSQL (sync server)
Payments: Stripe
Maps: MapLibre (offline capable)
CarPlay: react-native-carplay
Android Auto: Native module wrapper
Hosting: Railway or Fly.io (API) + Cloudflare R2 (content)
```

## Key Files to Create

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

## Success Criteria

- [ ] Sub-2-second response latency in conversation
- [ ] 95%+ speech recognition accuracy
- [ ] Zero-touch operation while driving
- [ ] Works offline for core content
- [ ] Handles poor cellular gracefully
- [ ] Indigenous content has explicit community consent

## Notes

- Sean's local-first philosophy applies - maximize offline capability
- Use Tailscale for dev testing across MacBook Pro and Mac mini
- Production-ready, not prototype - include Docker configs
- Ask before adding dependencies; tests OK autonomously
