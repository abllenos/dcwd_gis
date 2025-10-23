import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parseWKB } from '../utils/wkbParser';
import '../styles/GeometryMap.css';

interface GeometryMapProps {
  geom?: string; // WKB hex string from PostGIS
  height?: number;
  editable?: boolean;
  onLocationChange?: (longitude: number, latitude: number) => void;
  markerColor?: string;
  markerLabel?: string;
}

const GeometryMap: React.FC<GeometryMapProps> = ({
  geom,
  height = 400,
  editable = false,
  onLocationChange,
  markerColor = '#1890ff',
  markerLabel = 'Location'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Create custom colored icon
  const createCustomIcon = (color?: string) => {
    if (color && color !== '#1890ff') {
      // Create a colored marker using DivIcon for custom colors
      return L.divIcon({
        html: `<div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.4);
          transform: rotate(-45deg);
          position: relative;
        "><div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
        "></div></div>`,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [9, 32],
        popupAnchor: [0, -32]
      });
    }
    
    // Use standard Leaflet marker for default color
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      // Default center: Davao City, Philippines
      const defaultCenter: L.LatLngExpression = [7.0731, 125.6128];
      
      // Define Davao City bounds to restrict navigation
      const davaoBounds = L.latLngBounds(
        [6.9000, 125.4500], // Southwest corner
        [7.2500, 125.7500]  // Northeast corner
      );
      
      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
        maxBounds: davaoBounds,
        maxBoundsViscosity: 1.0, // Prevents panning outside bounds
        minZoom: 10, // Minimum zoom to keep focus on Davao City
        maxZoom: 18  // Maximum zoom for detailed view
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Additional bounds enforcement
      map.on('drag', () => {
        map.panInsideBounds(davaoBounds, { animate: false });
      });

      map.on('zoomend', () => {
        if (!davaoBounds.contains(map.getCenter())) {
          map.panTo(davaoBounds.getCenter());
        }
      });

      mapInstanceRef.current = map;

      // Add click handler for editable mode only
      if (editable) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          
          // Check if the click is within Davao bounds
          const davaoBounds = L.latLngBounds(
            [6.9000, 125.4500],
            [7.2500, 125.7500]
          );
          
          if (!davaoBounds.contains([lat, lng])) {
            // Don't allow placing markers outside Davao City
            return;
          }
          
          // Remove existing marker
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add new marker
          const marker = L.marker([lat, lng], {
            icon: createCustomIcon(markerColor),
            draggable: true
          }).addTo(map);

          marker.bindPopup(`${markerLabel}<br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`).openPopup();

          // Handle marker drag
          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            
            // Check if drag destination is within bounds
            if (!davaoBounds.contains(pos)) {
              // Revert to previous position if outside bounds
              marker.setLatLng([lat, lng]);
              return;
            }
            
            if (onLocationChange) {
              onLocationChange(pos.lng, pos.lat);
            }
            marker.bindPopup(`${markerLabel}<br>Lat: ${pos.lat.toFixed(6)}<br>Lng: ${pos.lng.toFixed(6)}`).openPopup();
          });

          markerRef.current = marker;

          // Notify parent of location change
          if (onLocationChange) {
            onLocationChange(lng, lat);
          }
        });
      }
    }
  }, [editable, onLocationChange, markerColor]);

  // Separate useEffect for handling geom changes to ensure map responds to data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing marker first
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Try to parse WKB geometry first
    let coordinates = parseWKB(geom);
    
    // If WKB parsing fails or no geom, try to use lat/lon if available
    // This handles cases where data might have lat/lon but invalid WKB
    if (!coordinates && geom) {
      // Check if geom contains lat/lon data in some other format
      console.warn('WKB parsing failed for geom:', geom);
    }
    
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      
      // Validate coordinates are within reasonable bounds
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        console.warn('Invalid coordinates:', { latitude, longitude });
        return;
      }
      
      // Smoothly animate to the new location
      map.setView([latitude, longitude], 16, {
        animate: true,
        duration: 1.0
      });
      
      // Force map to recalculate size after animation
      setTimeout(() => {
        map.invalidateSize();
      }, 200);

      // Add marker after the animation completes
      setTimeout(() => {
        const marker = L.marker([latitude, longitude], {
          icon: createCustomIcon(markerColor),
          draggable: false // Always non-draggable for existing locations
        }).addTo(map);

        // Create informative popup
        const popupContent = `
          <div style="text-align: center;">
            <strong>${markerLabel}</strong><br>
            <small>Latitude: ${latitude.toFixed(6)}</small><br>
            <small>Longitude: ${longitude.toFixed(6)}</small>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Auto-open popup to show location info
        marker.openPopup();

        markerRef.current = marker;
        
      }, 300);
    } else {
      // If no valid coordinates, center on Davao City default location
      console.warn('No valid coordinates found, using default center');
      map.setView([7.0731, 125.6128], 13);
      
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [geom, markerColor, markerLabel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="geometry-map-container">
      <div 
        ref={mapRef} 
        style={{ 
          height: `${height}px`, 
          width: '100%',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          backgroundColor: '#e0e0e0',
          position: 'relative',
          zIndex: 0
        }} 
      />
      {editable ? (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Click on the map to set location (restricted to Davao City area)
        </div>
      ) : (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#999',
          fontStyle: 'italic'
        }}>
          Location view only - marker position cannot be changed
        </div>
      )}
    </div>
  );
};

export default GeometryMap;
