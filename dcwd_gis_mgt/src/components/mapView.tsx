import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
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
  center?: {
    lat: number;
    lng: number;
  } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ geometry, center }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  const loadGoogleMapsScript = () => {
    if (document.querySelector('#google-maps-script')) {
      if (window.google) {
        window.initMap && window.initMap();
      }
      return;
    }

    const googleMapsScript = document.createElement('script');
    googleMapsScript.id = 'google-maps-script';
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyADLvGv3WeY3YCsDjWFackLgAOl7gxzGEA&libraries=places&callback=initMap`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    googleMapsScript.onerror = () => console.error('Error loading Google Maps script.');
    document.body.appendChild(googleMapsScript);
  };

  useEffect(() => {
  window.initMap = () => {
    if (mapRef.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 7.0819, lng: 125.5105 },
        zoom: 13,
      });

      if (geometry && geometry.coordinates.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        const validCoords = geometry.coordinates
          .filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng))  
          .map(coord => new window.google.maps.LatLng(coord.lat, coord.lng));

        if (validCoords.length === 0) {
          console.error('All coordinates are invalid, cannot fit bounds.');
          return;
        }

        validCoords.forEach(coord => bounds.extend(coord));

        const isPolygon =
          validCoords.length > 2 &&
          validCoords[0].lat() === validCoords[validCoords.length - 1].lat() &&
          validCoords[0].lng() === validCoords[validCoords.length - 1].lng();

        if (isPolygon) {
          const polygon = new window.google.maps.Polygon({
            paths: validCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
          });
          polygon.setMap(mapInstance.current);
        } else if (validCoords.length === 1) {
          new window.google.maps.Marker({
            position: validCoords[0],
            map: mapInstance.current,
            title: 'Single Coordinate Location',
          });
        } else {
          const polyline = new window.google.maps.Polyline({
            path: validCoords,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          polyline.setMap(mapInstance.current);
        }


        
        mapInstance.current.fitBounds(bounds);
      } else {
        console.error('No coordinates to display on the map or geometry is null.');
      }
    } else {
      console.error('Map element not found.');
    }
  };

  loadGoogleMapsScript();

  return () => {
    window.initMap = undefined;
    const script = document.querySelector('#google-maps-script');
    if (script) document.body.removeChild(script);
  };
}, [geometry, center]);


  return <div ref={mapRef} style={{ width: '100%', height: '800px' }} />;
};

export default MapComponent;