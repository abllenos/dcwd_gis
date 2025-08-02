import React, { useEffect } from 'react';
import { loadGoogleMapsScript } from '../Utils/loadMapScript';

interface MapComponentProps {
  lat: number;
  lng: number;
  onMapClick: (clickedLat: number, clickedLng: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, onMapClick }) => {
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
      })
      .catch((err) => {
        console.error('Google Maps failed to load:', err);
      });
  }, [lat, lng, onMapClick]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
