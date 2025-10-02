import React, { useEffect, useRef } from 'react';
import { Card, Typography } from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapViewer.css';
import Footer from './layout/Footer';

const { Title } = Typography;

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapViewer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map centered on Davao City, Philippines
      mapInstanceRef.current = L.map(mapRef.current).setView([7.1907, 125.4553], 12);
      // Limit map to Davao del Sur bounds
      // Approximate bounds for Davao del Sur province
      const davaoDelSurBounds = L.latLngBounds([
        [6.40, 124.90], // Southwest (near Malita)
        [7.40, 125.70]  // Northeast (near Davao City)
      ]);
      mapInstanceRef.current.setMaxBounds(davaoDelSurBounds);
      mapInstanceRef.current.setMinZoom(9);
      mapInstanceRef.current.setMaxZoom(18);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add a sample marker for Davao City Water District
      const marker = L.marker([7.1907, 125.4553]).addTo(mapInstanceRef.current);
      marker.bindPopup('<b>Davao City Water District</b><br>Main Office Location');

      // Add sample water infrastructure markers
      const waterInfrastructure = [
        { lat: 7.1950, lng: 125.4600, name: 'Water Treatment Plant A', type: 'treatment' },
        { lat: 7.1850, lng: 125.4500, name: 'Pumping Station 1', type: 'pumping' },
        { lat: 7.2000, lng: 125.4650, name: 'Water Tower North', type: 'storage' },
        { lat: 7.1800, lng: 125.4400, name: 'Distribution Hub Central', type: 'distribution' },
      ];

      // Add infrastructure markers with different colors
      waterInfrastructure.forEach(facility => {
        let iconColor = '#3388ff'; // Default blue
        
        switch (facility.type) {
          case 'treatment':
            iconColor = '#ff6b6b'; // Red for treatment plants
            break;
          case 'pumping':
            iconColor = '#4ecdc4'; // Teal for pumping stations
            break;
          case 'storage':
            iconColor = '#45b7d1'; // Light blue for storage
            break;
          case 'distribution':
            iconColor = '#96ceb4'; // Green for distribution
            break;
        }

        const customIcon = L.divIcon({
          html: `<div style="background-color: ${iconColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          className: 'custom-div-icon'
        });

        const facilityMarker = L.marker([facility.lat, facility.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current!);
        
        facilityMarker.bindPopup(`<b>${facility.name}</b><br>Type: ${facility.type}`);
      });

      // Add sample water pipes/lines
      const pipeLines: L.LatLngExpression[][] = [
        [[7.1907, 125.4553], [7.1950, 125.4600]], // Main office to treatment plant
        [[7.1950, 125.4600], [7.2000, 125.4650]], // Treatment to storage
        [[7.1950, 125.4600], [7.1850, 125.4500]], // Treatment to pumping
        [[7.1850, 125.4500], [7.1800, 125.4400]], // Pumping to distribution
      ];

      pipeLines.forEach(line => {
        L.polyline(line, { 
          color: '#2196F3', 
          weight: 3, 
          opacity: 0.7 
        }).addTo(mapInstanceRef.current!);
      });

      // Add sample DMA boundaries
      const dmaBoundary: L.LatLngExpression[] = [
        [7.1850, 125.4450],
        [7.1950, 125.4450],
        [7.1950, 125.4650],
        [7.1850, 125.4650],
        [7.1850, 125.4450]
      ];

      L.polygon(dmaBoundary, {
        color: '#ff7800',
        weight: 2,
        opacity: 0.8,
        fillColor: '#ff7800',
        fillOpacity: 0.2
      }).addTo(mapInstanceRef.current!)
        .bindPopup('Sample DMA Zone A<br>District Metering Area');
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div className="map-viewer-container">
        <Card className="map-viewer-card">
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} className="map-viewer-title">
              Map Viewer
            </Title>
          </div>

          <div className="map-legend-container">
            <div className="map-legend-item">
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ff6b6b', borderRadius: '50%' }}></div>
              <span className="map-legend-text">Treatment Plants</span>
            </div>
            <div className="map-legend-item">
              <div style={{ width: '12px', height: '12px', backgroundColor: '#4ecdc4', borderRadius: '50%' }}></div>
              <span className="map-legend-text">Pumping Stations</span>
            </div>
            <div className="map-legend-item">
              <div style={{ width: '12px', height: '12px', backgroundColor: '#45b7d1', borderRadius: '50%' }}></div>
              <span className="map-legend-text">Water Storage</span>
            </div>
            <div className="map-legend-item">
              <div style={{ width: '12px', height: '12px', backgroundColor: '#96ceb4', borderRadius: '50%' }}></div>
              <span className="map-legend-text">Distribution Hubs</span>
            </div>
            <div className="map-legend-item">
              <div style={{ width: '20px', height: '3px', backgroundColor: '#2196F3' }}></div>
              <span className="map-legend-text">Water Pipes</span>
            </div>
            <div className="map-legend-item">
              <div style={{ width: '20px', height: '12px', backgroundColor: '#ff7800', opacity: 0.3, border: '2px solid #ff7800' }}></div>
              <span className="map-legend-text">DMA Boundaries</span>
            </div>
          </div>

          <div ref={mapRef} className="map-container" />

          <div className="map-info-section">
            <p>Interactive GIS Map showing Davao City Water District infrastructure:</p>
            <ul className="map-info-list">
              <li>Water treatment facilities and pumping stations</li>
              <li>Distribution network and storage facilities</li>
              <li>District Metering Area (DMA) boundaries</li>
              <li>Water pipe network connections</li>
            </ul>
            <p className="map-info-italic">Click on markers and areas for more information.</p>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default MapViewer;