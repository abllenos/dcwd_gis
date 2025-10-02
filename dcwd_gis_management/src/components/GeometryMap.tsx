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

  // Create custom icon
  const createCustomIcon = (color: string) => {
    // Use standard Leaflet marker for now - working version
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
      const defaultCenter: L.LatLngExpression = [7.1907, 125.4553];
      
      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add click handler for editable mode
      if (editable) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          
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
            draggable: editable
          }).addTo(map);

          // Bind popup inside setTimeout after marker is added
          marker.bindPopup(`${markerLabel}<br>Lat: ${latitude.toFixed(6)}<br>Lng: ${longitude.toFixed(6)}`);

          if (editable) {
            marker.on('dragend', () => {
              const pos = marker.getLatLng();
              if (onLocationChange) {
                onLocationChange(pos.lng, pos.lat);
              }
              marker.bindPopup(`${markerLabel}<br>Lat: ${pos.lat.toFixed(6)}<br>Lng: ${pos.lng.toFixed(6)}`).openPopup();
            });
          }

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
      {editable && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Click on the map or drag the marker to update location
        </div>
      )}
    </div>
  );
};

export default GeometryMap;
