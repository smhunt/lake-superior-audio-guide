/**
 * Core type definitions for Lake Superior Audio Guide
 */

export interface POI {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: POICategory;
  content: POIContent;
  triggerDistance: number; // meters
}

export enum POICategory {
  GEOLOGICAL = 'geological',
  INDIGENOUS = 'indigenous',
  MARITIME = 'maritime',
  PARK = 'park',
  TOWN = 'town',
  WILDLIFE = 'wildlife',
}

export interface POIContent {
  quick: string;      // 15-30 seconds
  standard: string;   // 1-2 minutes
  deep: string;       // 3-5 minutes
  expert?: string;    // On-demand detailed content
}

export enum ContentDepth {
  QUICK = 'quick',
  STANDARD = 'standard',
  DEEP = 'deep',
  EXPERT = 'expert',
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
  encoding: string;
}
