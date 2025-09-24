import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initMap?: () => void;
  }
}

interface Coordinate { lat: number; lng: number }

export interface MapGeometry {
  coordinates: Coordinate[];
}

interface MapViewProps {
  geometry?: MapGeometry | null;
  center?: Coordinate | null;
  height?: number; // default 300
}

const DEFAULT_CENTER: Coordinate = { lat: 7.0819, lng: 125.5105 };

const MapView: React.FC<MapViewProps> = ({ geometry, center, height = 300 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);

  const loadGoogleMapsScript = () => {
    if (typeof window === 'undefined') return;
    if (document.querySelector('#google-maps-script')) {
      if (window.google) {
        window.initMap && window.initMap();
      }
      return;
    }

    const key = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY || '';
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => console.error('Error loading Google Maps script.');
    document.body.appendChild(script);
  };

  useEffect(() => {
    window.initMap = () => {
      if (!mapRef.current) return;
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: center || DEFAULT_CENTER,
        zoom: 13,
      });

      const coords = geometry?.coordinates || [];
      if (coords.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        const valid = coords
          .filter((c) => !isNaN(c.lat) && !isNaN(c.lng))
          .map((c) => new window.google.maps.LatLng(c.lat, c.lng));
        if (valid.length === 1) {
          new window.google.maps.Marker({ position: valid[0], map: mapInstance.current });
          mapInstance.current.setCenter(valid[0]);
          mapInstance.current.setZoom(16);
        } else if (valid.length > 1) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          valid.forEach((v: any) => bounds.extend(v));
          // polygon if closed ring
          const isPolygon = valid.length > 2 && valid[0].lat() === valid[valid.length - 1].lat() && valid[0].lng() === valid[valid.length - 1].lng();
          if (isPolygon) {
            const polygon = new window.google.maps.Polygon({
              paths: valid,
              strokeColor: '#1677ff',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: '#1677ff',
              fillOpacity: 0.2,
            });
            polygon.setMap(mapInstance.current);
          } else {
            const polyline = new window.google.maps.Polyline({
              path: valid,
              geodesic: true,
              strokeColor: '#1677ff',
              strokeOpacity: 1,
              strokeWeight: 2,
            });
            polyline.setMap(mapInstance.current);
          }
          mapInstance.current.fitBounds(bounds);
        }
      }
    };

    if (window.google && window.google.maps) {
      window.initMap && window.initMap();
    } else {
      loadGoogleMapsScript();
    }

    return () => {
      // Keep the script loaded for reuse; just clear the callback.
      window.initMap = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry?.coordinates?.length, center?.lat, center?.lng]);

  return <div ref={mapRef} style={{ width: '100%', height }} />;
};

export default MapView;
