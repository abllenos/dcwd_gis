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

    // Update marker based on geom prop
    const map = mapInstanceRef.current;
    if (map) {
      const coords = parseWKB(geom);
      
      if (coords) {
        const { latitude, longitude } = coords;
        
        // Center map on coordinates
        map.setView([latitude, longitude], 15);
        
        // Force map to recalculate size
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        // Add marker with delay to ensure map is ready
        setTimeout(() => {
          // Remove existing marker
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Create marker
          const marker = L.marker([latitude, longitude], {
            icon: createCustomIcon(markerColor),
            draggable: false // Always non-draggable for existing locations
          }).addTo(map);

          // Bind popup inside setTimeout after marker is added
          marker.bindPopup(`${markerLabel}<br>Lat: ${latitude.toFixed(6)}<br>Lng: ${longitude.toFixed(6)}`);

          // Don't add drag handlers for existing markers to prevent accidental changes

          markerRef.current = marker;
        }, 150);
      }
    }

    return () => {
      // Don't destroy map on every render, only on unmount
    };
  }, [geom, editable, onLocationChange, markerColor, markerLabel]);

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
