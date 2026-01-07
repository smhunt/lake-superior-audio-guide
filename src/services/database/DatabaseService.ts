/**
 * Database Service
 * Handles SQLite database operations for POI storage
 */

import * as SQLite from 'expo-sqlite';
import { POI, POICategory } from '../../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbName = 'lake_superior_guide.db';

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(this.dbName);
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS pois (
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

      CREATE INDEX IF NOT EXISTS idx_pois_category ON pois(category);
      CREATE INDEX IF NOT EXISTS idx_pois_location ON pois(latitude, longitude);
    `);
  }

  /**
   * Insert or update a POI
   */
  async upsertPOI(poi: POI): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO pois (
        id, name, latitude, longitude, category, trigger_distance,
        content_quick, content_standard, content_deep, content_expert,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))`,
      [
        poi.id,
        poi.name,
        poi.latitude,
        poi.longitude,
        poi.category,
        poi.triggerDistance,
        poi.content.quick,
        poi.content.standard,
        poi.content.deep,
        poi.content.expert || null,
      ]
    );
  }

  /**
   * Get all POIs
   */
  async getAllPOIs(): Promise<POI[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync('SELECT * FROM pois ORDER BY name');
    return rows.map((row: any) => this.rowToPOI(row));
  }

  /**
   * Get POI by ID
   */
  async getPOIById(id: string): Promise<POI | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync('SELECT * FROM pois WHERE id = ?', [id]);
    return row ? this.rowToPOI(row as any) : null;
  }

  /**
   * Get POIs by category
   */
  async getPOIsByCategory(category: POICategory): Promise<POI[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync(
      'SELECT * FROM pois WHERE category = ? ORDER BY name',
      [category]
    );
    return rows.map((row: any) => this.rowToPOI(row));
  }

  /**
   * Get POIs within a bounding box
   */
  async getPOIsInBounds(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ): Promise<POI[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync(
      `SELECT * FROM pois
       WHERE latitude BETWEEN ? AND ?
       AND longitude BETWEEN ? AND ?
       ORDER BY name`,
      [minLat, maxLat, minLng, maxLng]
    );
    return rows.map((row: any) => this.rowToPOI(row));
  }

  /**
   * Get POIs near a location
   * Note: This is a simple rectangular search. For more accuracy, use haversine in app code.
   */
  async getPOIsNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<POI[]> {
    // Rough conversion: 1 degree ≈ 111km at equator
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    return this.getPOIsInBounds(
      latitude - latDelta,
      latitude + latDelta,
      longitude - lngDelta,
      longitude + lngDelta
    );
  }

  /**
   * Get count of POIs by category
   */
  async getPOICountByCategory(): Promise<Record<string, number>> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync(
      'SELECT category, COUNT(*) as count FROM pois GROUP BY category'
    );

    const result: Record<string, number> = {};
    rows.forEach((row: any) => {
      result[row.category] = row.count;
    });
    return result;
  }

  /**
   * Delete a POI
   */
  async deletePOI(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM pois WHERE id = ?', [id]);
  }

  /**
   * Clear all POIs (useful for testing/reset)
   */
  async clearAllPOIs(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM pois');
  }

  /**
   * Seed database with initial POI data
   */
  async seedDatabase(pois: POI[]): Promise<void> {
    console.log(`Seeding database with ${pois.length} POIs...`);

    for (const poi of pois) {
      await this.upsertPOI(poi);
    }

    console.log('Database seeding complete');
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    totalPOIs: number;
    byCategory: Record<string, number>;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const totalResult = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM pois'
    );
    const total = (totalResult as any)?.count || 0;

    const byCategory = await this.getPOICountByCategory();

    return {
      totalPOIs: total,
      byCategory,
    };
  }

  /**
   * Convert database row to POI object
   */
  private rowToPOI(row: any): POI {
    return {
      id: row.id,
      name: row.name,
      latitude: row.latitude,
      longitude: row.longitude,
      category: row.category as POICategory,
      triggerDistance: row.trigger_distance,
      content: {
        quick: row.content_quick,
        standard: row.content_standard,
        deep: row.content_deep,
        expert: row.content_expert || undefined,
      },
    };
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default DatabaseService;
