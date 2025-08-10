import React, { useEffect, useRef } from 'react';
import { loadGoogleMapsScript } from '../Utils/loadMapScript';
/// <reference types="@types/google.maps" />

interface MapComponentProps {
  lat: number;
  lng: number;
  onMapClick: (clickedLat: number, clickedLng: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, onMapClick }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Initialize map and marker once on mount
  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        const map = new google.maps.Map(
          document.getElementById('map') as HTMLElement,
          {
            center: { lat, lng },
            zoom: 16,
          }
        );

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          draggable: true,
        });

        marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
          const newLat = e.latLng?.lat();
          const newLng = e.latLng?.lng();
          if (newLat !== undefined && newLng !== undefined) {
            onMapClick(newLat, newLng);
          }
        });

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          const newLat = e.latLng?.lat();
          const newLng = e.latLng?.lng();
          if (newLat !== undefined && newLng !== undefined) {
            marker.setPosition({ lat: newLat, lng: newLng });
            onMapClick(newLat, newLng);
          }
        });

        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch((err) => {
        console.error('Google Maps failed to load:', err);
      });
  }, [onMapClick]); 
  
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const newPosition = new google.maps.LatLng(lat, lng);
      markerRef.current.setPosition(newPosition);
      mapRef.current.setCenter(newPosition);
      mapRef.current.setZoom(16);
    }
  }, [lat, lng]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
