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

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        const map = new google.maps.Map(
          document.getElementById('map') as HTMLElement,
          {
            center: { lat: 7.0720282, lng: 125.6120311 },
            zoom: 13,
          }
        );

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          const newLat = e.latLng?.lat();
          const newLng = e.latLng?.lng();
          if (newLat !== undefined && newLng !== undefined) {
            if (!markerRef.current) {
              markerRef.current = new google.maps.Marker({
                position: { lat: newLat, lng: newLng },
                map,
                draggable: true,
              });

              markerRef.current.addListener('dragend', (ev: google.maps.MapMouseEvent) => {
                const dragLat = ev.latLng?.lat();
                const dragLng = ev.latLng?.lng();
                if (dragLat !== undefined && dragLng !== undefined) {
                  onMapClick(dragLat, dragLng);
                }
              });
            } else {
              markerRef.current.setPosition({ lat: newLat, lng: newLng });
            }
            onMapClick(newLat, newLng);
          }
        });

        mapRef.current = map;
      })
      .catch((err) => {
        console.error('Google Maps failed to load:', err);
      });
  }, [onMapClick]);

  
  useEffect(() => {
    if (mapRef.current && lat && lng) {
      const newPosition = new google.maps.LatLng(lat, lng);
      mapRef.current.setCenter(newPosition);
      mapRef.current.setZoom(16);

      if (!markerRef.current) {
        markerRef.current = new google.maps.Marker({
          position: newPosition,
          map: mapRef.current,
          draggable: true,
        });

        markerRef.current.addListener('dragend', (e: google.maps.MapMouseEvent) => {
          const dragLat = e.latLng?.lat();
          const dragLng = e.latLng?.lng();
          if (dragLat !== undefined && dragLng !== undefined) {
            onMapClick(dragLat, dragLng);
          }
        });
      } else {
        markerRef.current.setPosition(newPosition);
      }
    }
  }, [lat, lng]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
