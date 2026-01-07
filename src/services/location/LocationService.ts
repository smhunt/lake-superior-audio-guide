/**
 * Location Service
 * Handles GPS tracking, geofencing, and POI proximity detection
 */

import * as Location from 'expo-location';
import { LocationData, POI } from '../../types';

class LocationService {
  private currentLocation: LocationData | null = null;
  private watchSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      return backgroundStatus.status === 'granted';
    }

    return false;
  }

  /**
   * Start tracking location
   */
  async startTracking(callback: (location: LocationData) => void): Promise<void> {
    if (this.isTracking) {
      return;
    }

    this.isTracking = true;

    this.watchSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Or when moved 10 meters
      },
      (location) => {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || 0,
          timestamp: new Date(location.timestamp),
        };

        this.currentLocation = locationData;
        callback(locationData);
      }
    );
  }

  /**
   * Stop tracking location
   */
  stopTracking(): void {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
    this.isTracking = false;
  }

  /**
   * Get current location
   */
  getCurrentLocation(): LocationData | null {
    return this.currentLocation;
  }

  /**
   * Calculate distance to POI in meters
   */
  calculateDistance(poi: POI): number {
    if (!this.currentLocation) {
      return Infinity;
    }

    return this.haversineDistance(
      this.currentLocation.latitude,
      this.currentLocation.longitude,
      poi.latitude,
      poi.longitude
    );
  }

  /**
   * Haversine formula for calculating distance between two coordinates
   */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default LocationService;
