/**
 * POI Browser Component
 * Test component to browse and verify POI database
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ContentService from '../services/content/ContentService';
import { POI, POICategory } from '../types';

const POIBrowser: React.FC = () => {
  const [contentService] = useState(() => new ContentService());
  const [pois, setPois] = useState<POI[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalPOIs: number; byCategory: Record<string, number> } | null>(null);
  const [filter, setFilter] = useState<POICategory | 'all'>('all');

  useEffect(() => {
    loadPOIs();
  }, []);

  const loadPOIs = async () => {
    try {
      setLoading(true);
      await contentService.initialize();
      const allPOIs = await contentService.getPOIs();
      setPois(allPOIs);
      const dbStats = await contentService.getStats();
      setStats(dbStats);
    } catch (error) {
      console.error('Failed to load POIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPOIs = async (category: POICategory | 'all') => {
    setFilter(category);
    if (category === 'all') {
      const allPOIs = await contentService.getPOIs();
      setPois(allPOIs);
    } else {
      const filtered = await contentService.getPOIsByCategory(category);
      setPois(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading POI database...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📍 POI Database</Text>
        {stats && (
          <Text style={styles.subtitle}>
            {stats.totalPOIs} locations loaded
          </Text>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => filterPOIs('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All ({stats?.totalPOIs || 0})
            </Text>
          </TouchableOpacity>
          {Object.entries(stats?.byCategory || {}).map(([category, count]) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterButton, filter === category && styles.filterButtonActive]}
              onPress={() => filterPOIs(category as POICategory)}
            >
              <Text style={[styles.filterText, filter === category && styles.filterTextActive]}>
                {category} ({count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* POI List */}
      <View style={styles.poiList}>
        {pois.map((poi) => (
          <TouchableOpacity
            key={poi.id}
            style={styles.poiCard}
            onPress={() => setSelectedPOI(selectedPOI?.id === poi.id ? null : poi)}
          >
            <View style={styles.poiHeader}>
              <Text style={styles.poiName}>{poi.name}</Text>
              <Text style={styles.poiCategory}>{poi.category}</Text>
            </View>
            <Text style={styles.poiLocation}>
              📍 {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
            </Text>
            <Text style={styles.poiTrigger}>
              Trigger: {poi.triggerDistance}m radius
            </Text>

            {selectedPOI?.id === poi.id && (
              <View style={styles.poiContent}>
                <Text style={styles.contentLabel}>Quick:</Text>
                <Text style={styles.contentText}>{poi.content.quick}</Text>

                <Text style={styles.contentLabel}>Standard:</Text>
                <Text style={styles.contentText}>{poi.content.standard}</Text>

                <Text style={styles.contentLabel}>Deep:</Text>
                <Text style={styles.contentText}>{poi.content.deep}</Text>

                {poi.content.expert && (
                  <>
                    <Text style={styles.contentLabel}>Expert:</Text>
                    <Text style={styles.contentText}>{poi.content.expert}</Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  poiList: {
    paddingBottom: 40,
  },
  poiCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  poiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  poiName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    flex: 1,
  },
  poiCategory: {
    fontSize: 12,
    color: '#60a5fa',
    textTransform: 'capitalize',
    backgroundColor: '#1e3a5f',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  poiLocation: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
  poiTrigger: {
    fontSize: 12,
    color: '#64748b',
  },
  poiContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  contentLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  contentText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});

export default POIBrowser;
