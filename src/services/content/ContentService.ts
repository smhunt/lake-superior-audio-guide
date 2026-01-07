/**
 * Content Service
 * Manages POI database and content retrieval
 */

import { POI, POICategory, ContentDepth } from '../../types';

class ContentService {
  private pois: POI[] = [];

  /**
   * Load POIs from local database
   * TODO: Implement SQLite storage
   */
  async loadPOIs(): Promise<void> {
    // Placeholder - will implement SQLite loading
    this.pois = this.getSamplePOIs();
  }

  /**
   * Get all POIs
   */
  getPOIs(): POI[] {
    return this.pois;
  }

  /**
   * Get POIs by category
   */
  getPOIsByCategory(category: POICategory): POI[] {
    return this.pois.filter((poi) => poi.category === category);
  }

  /**
   * Get POI by ID
   */
  getPOIById(id: string): POI | undefined {
    return this.pois.find((poi) => poi.id === id);
  }

  /**
   * Get POI content at specific depth
   */
  getPOIContent(poi: POI, depth: ContentDepth): string {
    switch (depth) {
      case ContentDepth.QUICK:
        return poi.content.quick;
      case ContentDepth.STANDARD:
        return poi.content.standard;
      case ContentDepth.DEEP:
        return poi.content.deep;
      case ContentDepth.EXPERT:
        return poi.content.expert || poi.content.deep;
      default:
        return poi.content.standard;
    }
  }

  /**
   * Sample POIs for initial development
   */
  private getSamplePOIs(): POI[] {
    return [
      {
        id: 'agawa-rock',
        name: 'Agawa Rock Pictographs',
        latitude: 47.6442,
        longitude: -84.8897,
        category: POICategory.INDIGENOUS,
        triggerDistance: 2000, // 2km
        content: {
          quick:
            "You're approaching Agawa Rock, home to sacred Indigenous pictographs painted hundreds of years ago on the Canadian Shield.",
          standard:
            "Agawa Rock in Lake Superior Provincial Park features ancient Ojibwe pictographs painted directly on the 2.7 billion year old Canadian Shield. These sacred images, including the great water lynx Mishipeshu, tell stories of spiritual journeys and encounters with the lake's powerful forces.",
          deep:
            "Agawa Rock represents a unique intersection of geological and cultural history. The pictographs were painted using red ochre pigment on the ancient Canadian Shield rock face, which has withstood billions of years of geological change. The images depict Mishipeshu, the great water lynx who controls the lake's waters, along with canoes and other spiritual symbols. These were created as offerings and records of vision quests, accessible only by canoe and during calm water conditions.",
        },
      },
      {
        id: 'sleeping-giant',
        name: 'Sleeping Giant',
        latitude: 48.5184,
        longitude: -88.8294,
        category: POICategory.GEOLOGICAL,
        triggerDistance: 5000, // 5km
        content: {
          quick:
            "That's Sleeping Giant—a massive mesa formation visible from Thunder Bay, sacred to the Ojibwe people.",
          standard:
            "The Sleeping Giant is a mesa over 240 meters high formed from ancient volcanic sills. In Ojibwe legend, it's the warrior Nanabijou, turned to stone while protecting the secret location of a silver mine. The formation is composed of diabase rock intruded about 1.1 billion years ago.",
          deep:
            "Sleeping Giant Provincial Park's iconic mesa tells both a geological and cultural story. The formation is part of the Logan Sills, diabase intrusions from 1.1 billion years ago that create the distinctive cliff faces. The Ojibwe legend speaks of Nanabijou, who revealed the location of a rich silver mine on condition it remain secret. When white prospectors discovered it, Nanabijou was turned to stone as punishment, creating the formation we see today. The actual silver mining history of Silver Islet nearby adds a layer of truth to the legend.",
        },
      },
    ];
  }
}

export default ContentService;
