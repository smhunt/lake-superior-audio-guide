# Lake Superior Audio Guide - POI Database

## Overview

SQLite-based local storage system for Points of Interest (POI) along Lake Superior. Enables offline access, efficient querying, and location-based content delivery.

## Architecture

```
ContentService
    ↓
DatabaseService (SQLite)
    ↓
POI Table (12 locations currently)
```

## Database Schema

### POI Table

```sql
CREATE TABLE pois (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  category TEXT NOT NULL,
  trigger_distance INTEGER NOT NULL,
  content_quick TEXT NOT NULL,
  content_standard TEXT NOT NULL,
  content_deep TEXT NOT NULL,
  content_expert TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_pois_category ON pois(category);
CREATE INDEX idx_pois_location ON pois(latitude, longitude);
```

## POI Categories

| Category | Description | Current Count |
|----------|-------------|---------------|
| `geological` | Rock formations, Canadian Shield features | 4 |
| `indigenous` | Ojibwe sites, pictographs, sacred locations | 1 |
| `maritime` | Shipwrecks, lighthouses, nautical history | 1 |
| `park` | Provincial/National parks | 2 |
| `town` | Communities, cities | 3 |
| `wildlife` | Animal habitats, ecological zones | 1 |

**Total POIs**: 12 locations

## Current POI Coverage

### Route: Sault Ste. Marie → Thunder Bay (Trans-Canada Highway 17)

1. **Sault Ste. Marie** (Town) - Start point, Soo Locks
2. **Batchawana Bay** (Geological) - Sandy beaches, rounded stones
3. **Agawa Rock** (Indigenous) - Sacred pictographs
4. **Lake Superior Provincial Park** (Park) - Protected coastline
5. **Canadian Shield Exposure** (Geological) - 2.7B year old rock
6. **Wawa** (Town) - Canada Goose statue, gateway
7. **Pukaskwa National Park** (Park) - Wilderness area
8. **Moose Habitat Zone** (Wildlife) - High moose population
9. **Edmund Fitzgerald Memorial** (Maritime) - 1975 shipwreck
10. **Ouimet Canyon** (Geological) - 150m deep gorge
11. **Sleeping Giant** (Geological) - Mesa formation, Ojibwe legend
12. **Thunder Bay** (Town) - Major city, port

## Content Depth Levels

Each POI includes four content depths:

| Depth | Length | Use Case |
|-------|--------|----------|
| **Quick** | 15-30 seconds | Passing mention while driving |
| **Standard** | 1-2 minutes | Basic interesting facts |
| **Deep** | 3-5 minutes | Detailed story with context |
| **Expert** | 5+ minutes | Comprehensive information (optional) |

## DatabaseService API

### Initialization

```typescript
const dbService = new DatabaseService();
await dbService.initialize(); // Creates tables, indexes
```

### Insert/Update POI

```typescript
await dbService.upsertPOI(poi);
```

### Query POIs

```typescript
// Get all POIs
const all = await dbService.getAllPOIs();

// Get by ID
const poi = await dbService.getPOIById('agawa-rock');

// Get by category
const parks = await dbService.getPOIsByCategory(POICategory.PARK);

// Get within bounding box
const inBounds = await dbService.getPOIsInBounds(47.0, 49.0, -89.0, -84.0);

// Get near location (50km radius)
const nearby = await dbService.getPOIsNearLocation(47.6442, -84.8897, 50);
```

### Statistics

```typescript
const stats = await dbService.getStats();
// Returns: { totalPOIs: 12, byCategory: {...} }
```

### Seeding

```typescript
import { SEED_POIS } from '../data/poi/seed-data';
await dbService.seedDatabase(SEED_POIS);
```

## ContentService API

### Initialization

```typescript
const contentService = new ContentService();
await contentService.initialize(); // Auto-seeds if empty
```

### Access POIs

```typescript
// Get all POIs
const pois = await contentService.getPOIs();

// Get by category
const geological = await contentService.getPOIsByCategory(POICategory.GEOLOGICAL);

// Get by ID
const poi = await contentService.getPOIById('sleeping-giant');

// Get near location
const nearby = await contentService.getPOIsNearLocation(48.38, -89.25, 30);
```

### Content Retrieval

```typescript
const poi = await contentService.getPOIById('agawa-rock');
const quick = contentService.getPOIContent(poi, ContentDepth.QUICK);
const deep = contentService.getPOIContent(poi, ContentDepth.DEEP);
```

## Data Files

- **Schema**: `src/services/database/DatabaseService.ts`
- **Seed Data**: `src/data/poi/seed-data.ts`
- **Service**: `src/services/content/ContentService.ts`
- **Types**: `src/types/index.ts`

## Database Location

```
iOS: DocumentDirectory/SQLite/lake_superior_guide.db
Android: databases/lake_superior_guide.db
```

## Offline Capabilities

✅ **All POI data stored locally** - Works without internet
✅ **Fast queries** - Indexed by location and category
✅ **Auto-initialization** - Creates DB on first launch
✅ **Auto-seeding** - Populates with initial 12 POIs

## Future Enhancements

### Phase 2.2: Proximity Detection
- Monitor GPS location
- Detect when approaching POIs
- Trigger notifications based on `trigger_distance`
- Auto-inject location context into Claude

### Phase 2.3: Content Expansion
- Expand to 50+ POIs covering full route
- Add Michigan side (US) for complete circle
- Seasonal content variations
- User-contributed POIs

### Phase 2.4: Advanced Queries
- Route-based POI loading
- Preload POIs along planned route
- Distance-sorted results
- Category-based filtering in UI

## Testing POI Database

Use the POIBrowser component to view and test database:

```typescript
import POIBrowser from './src/components/POIBrowser';

// In App.tsx (for testing)
<POIBrowser />
```

Features:
- View all 12 POIs
- Filter by category
- Expand to read all content depths
- See location coordinates
- Check trigger distances

## Adding New POIs

1. **Add to seed data** (`src/data/poi/seed-data.ts`):

```typescript
{
  id: 'my-new-poi',
  name: 'My New Location',
  latitude: 48.0000,
  longitude: -85.0000,
  category: POICategory.GEOLOGICAL,
  triggerDistance: 2000,
  content: {
    quick: "Brief description...",
    standard: "Standard 1-2 min description...",
    deep: "Detailed 3-5 min description...",
    expert: "Optional expert-level content..." // Optional
  }
}
```

2. **Reseed database**:

```typescript
const contentService = new ContentService();
await contentService.initialize();
await contentService.reseedDatabase(); // Clears and reloads
```

## Performance

- **Initialization**: ~100-200ms (first launch)
- **Query all POIs**: ~10-20ms
- **Query by location**: ~5-15ms (with spatial index)
- **Query by ID**: ~1-5ms (primary key)
- **Database size**: ~50KB (12 POIs with full content)

## Best Practices

1. **Always initialize** before using ContentService
2. **Cache POI queries** where possible (they don't change often)
3. **Use location queries** instead of loading all POIs
4. **Handle initialization errors** gracefully
5. **Close connections** when done (ContentService handles this)

## Migration Strategy

To update POI data in production:

```typescript
// Option 1: Reseed (replaces all data)
await contentService.reseedDatabase();

// Option 2: Upsert individual POIs (updates existing)
await contentService.upsertPOI(updatedPOI);

// Option 3: Delete specific POI
await contentService.deletePOI('poi-id');
```

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project overview
- [VOICE_ASSISTANT.md](./VOICE_ASSISTANT.md) - Voice interface
- [AUDIO_PIPELINE.md](./AUDIO_PIPELINE.md) - Audio processing
- [progress.md](../progress.md) - Current status
