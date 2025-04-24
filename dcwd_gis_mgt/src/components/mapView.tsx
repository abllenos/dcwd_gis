import React, { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    google: typeof import('google.maps');
    initMap?: () => void;
  }
}

interface Coordinate {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  geometry: {
    coordinates: Coordinate[];
  } | null;
  center?: Coordinate | null;
  apiKey: string;
  mapOptions?: google.maps.MapOptions;
  style?: React.CSSProperties;
  onError?: (error: string) => void;
}

const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  zoom: 13,
  mapTypeControl: false,
  streetViewControl: false,
};

const DEFAULT_CENTER: Coordinate = { lat: 7.0819, lng: 125.5105 };

const MapComponent: React.FC<MapComponentProps> = ({
  geometry,
  center = DEFAULT_CENTER,
  apiKey,
  mapOptions = DEFAULT_MAP_OPTIONS,
  style = { width: '100%', height: '600px' },
  onError,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleError = useCallback((error: string) => {
    console.error(error);
    setMapError(error);
    onError?.(error);
    setLoading(false);
  }, [onError]);

  const validateCoordinate = useCallback((coord: Coordinate): boolean => {
    return (
      !isNaN(coord.lat) &&
      !isNaN(coord.lng) &&
      Math.abs(coord.lat) <= 90 &&
      Math.abs(coord.lng) <= 180
    );
  }, []);

  const loadGoogleMapsScript = useCallback(() => {
    if (scriptLoaded) return;

    if (window.google?.maps) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('#google-maps-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyADLvGv3WeY3YCsDjWFackLgAOl7gxzGEA&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setScriptLoaded(true);
      setLoading(false);
    };
    
    script.onerror = () => handleError('Failed to load Google Maps script');
    
    document.head.appendChild(script);
  }, [apiKey, handleError, scriptLoaded]);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) {
      handleError('Map container not found or Google Maps not loaded');
      return;
    }

    try {
      const initialCenter = center || DEFAULT_CENTER;
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        ...mapOptions,
        center: initialCenter,
      });

      if (!geometry?.coordinates?.length) {
        setLoading(false);
        return;
      }

      const validCoords = geometry.coordinates
        .filter(validateCoordinate)
        .map(coord => new google.maps.LatLng(coord.lat, coord.lng));

      if (!validCoords.length) {
        handleError('No valid coordinates provided');
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      validCoords.forEach(coord => bounds.extend(coord));

    
      const isPolygon = validCoords.length > 2 && 
        Math.abs(validCoords[0].lat() - validCoords[validCoords.length - 1].lat()) < 1e-9 &&
        Math.abs(validCoords[0].lng() - validCoords[validCoords.length - 1].lng()) < 1e-9;

      let mapFeature: google.maps.Polygon | google.maps.Polyline | google.maps.Marker;

      if (isPolygon) {
        mapFeature = new google.maps.Polygon({
          paths: validCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
        });
      } else if (validCoords.length === 1) {
        mapFeature = new google.maps.Marker({
          position: validCoords[0],
          map: mapInstance.current,
          title: 'Location',
        });
      } else {
        mapFeature = new google.maps.Polyline({
          path: validCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });
      }

      mapFeature.setMap(mapInstance.current);
      mapInstance.current.fitBounds(bounds);
      setLoading(false);
    } catch (error) {
      handleError(`Map initialization failed: ${(error as Error).message}`);
    }
  }, [geometry, center, mapOptions, handleError, validateCoordinate]);

  useEffect(() => {
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);

  useEffect(() => {
    if (scriptLoaded) {
      initializeMap();
    }
  }, [scriptLoaded, initializeMap]);

  return (
    <div className="map-container">
      {loading && <div className="map-loading">Loading map...</div>}
      {mapError && (
        <div className="map-error">
          Error: {mapError}
        </div>
      )}
      <div 
        ref={mapRef} 
        style={style}
        aria-label="Google Map"
        role="application"
      />
    </div>
  );
};

export default MapComponent;