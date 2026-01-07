# Lake Superior AI Audio Guide

Interactive AI-driven audio companion for Lake Superior travel. Ask questions about geology, Indigenous history, shipwrecks, and attractions while driving.

## Features

- **Conversational AI**: Natural language questions powered by Claude
- **CarPlay/Android Auto**: Hands-free operation while driving
- **Location-Aware**: Proactive info as you approach points of interest
- **Offline-First**: Works in cellular dead zones
- **Multi-Depth Content**: Quick facts to deep dives on demand

## Quick Start

```bash
# Install dependencies
npm install

# iOS development
npx pod-install
npm run ios

# Android development
npm run android

# Start development server
npm start
```

## Environment Setup

```bash
cp .env.example .env
# Add your keys:
# ANTHROPIC_API_KEY=
# STRIPE_PUBLISHABLE_KEY=
```

## Project Structure

See `prompt_plan.md` for implementation phases.
See `progress.md` for current status.

## Development

Using Sean's workflow:
- Check `prompt_plan.md` and `progress.md` before starting
- Confirm plan before executing non-trivial changes
- Tests and diagnostics OK autonomously
- Ask before schema/infra/dependency changes

## License

Proprietary - EcoWorks Web Architecture Inc.
