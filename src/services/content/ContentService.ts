/**
 * Content Service
 * Manages POI database and content retrieval using SQLite
 */

import { POI, POICategory, ContentDepth } from '../../types';
import DatabaseService from '../database/DatabaseService';
import { SEED_POIS } from '../../data/poi/seed-data';

class ContentService {
  private db: DatabaseService;
  private initialized = false;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Initialize database and load POIs
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.db.initialize();

      // Check if database is empty and seed if needed
      const stats = await this.db.getStats();
      if (stats.totalPOIs === 0) {
        console.log('Database empty, seeding with initial POI data...');
        await this.db.seedDatabase(SEED_POIS);
      }

      this.initialized = true;
      console.log(`ContentService initialized. Total POIs: ${stats.totalPOIs}`);
    } catch (error) {
      console.error('Failed to initialize ContentService:', error);
      throw error;
    }
  }

  /**
   * Get all POIs
   */
  async getPOIs(): Promise<POI[]> {
    this.ensureInitialized();
    return await this.db.getAllPOIs();
  }

  /**
   * Get POIs by category
   */
  async getPOIsByCategory(category: POICategory): Promise<POI[]> {
    this.ensureInitialized();
    return await this.db.getPOIsByCategory(category);
  }

  /**
   * Get POI by ID
   */
  async getPOIById(id: string): Promise<POI | null> {
    this.ensureInitialized();
    return await this.db.getPOIById(id);
  }

  /**
   * Get POIs near a location
   */
  async getPOIsNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<POI[]> {
    this.ensureInitialized();
    return await this.db.getPOIsNearLocation(latitude, longitude, radiusKm);
  }

  /**
   * Get POIs within bounding box
   */
  async getPOIsInBounds(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ): Promise<POI[]> {
    this.ensureInitialized();
    return await this.db.getPOIsInBounds(minLat, maxLat, minLng, maxLng);
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
   * Get database statistics
   */
  async getStats(): Promise<{
    totalPOIs: number;
    byCategory: Record<string, number>;
  }> {
    this.ensureInitialized();
    return await this.db.getStats();
  }

  /**
   * Add or update a POI
   */
  async upsertPOI(poi: POI): Promise<void> {
    this.ensureInitialized();
    await this.db.upsertPOI(poi);
  }

  /**
   * Delete a POI
   */
  async deletePOI(id: string): Promise<void> {
    this.ensureInitialized();
    await this.db.deletePOI(id);
  }

  /**
   * Reseed database (useful for updates)
   */
  async reseedDatabase(): Promise<void> {
    this.ensureInitialized();
    await this.db.clearAllPOIs();
    await this.db.seedDatabase(SEED_POIS);
    console.log('Database reseeded successfully');
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        'ContentService not initialized. Call initialize() first.'
      );
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await this.db.close();
    this.initialized = false;
  }
}

export default ContentService;
