// Leaflet refactor: replace Google Maps (API key errors) with open-source Leaflet per repo guidance.
// Keeps props contract identical so callers (LogPage) remain unchanged.
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Coordinate { lat: number; lng: number }
export interface MapGeometry { coordinates: Coordinate[] }

interface MapViewProps {
  geometry?: MapGeometry | null;
  center?: Coordinate | null;
  height?: number;
}

const DEFAULT_CENTER: Coordinate = { lat: 7.0819, lng: 125.5105 };

const MapView: React.FC<MapViewProps> = ({ geometry, center, height = 300 }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!divRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(divRef.current, {
        center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        zoom: 13,
        zoomControl: true,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Clear previous geometry layers
    layerGroupRef.current?.clearLayers();

    const coords = geometry?.coordinates || [];
    const valid = coords.filter(c => Number.isFinite(c.lat) && Number.isFinite(c.lng));
    if (valid.length === 0) {
      // Optionally center to provided center or default
      if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
        mapRef.current!.setView([center.lat, center.lng], 13);
      }
      return;
    }

    if (valid.length === 1) {
      const m = L.marker([valid[0].lat, valid[0].lng]);
      layerGroupRef.current!.addLayer(m);
      mapRef.current!.setView([valid[0].lat, valid[0].lng], 16);
    } else {
      // Detect closed ring (polygon) if first == last
      const first = valid[0];
      const last = valid[valid.length - 1];
      const isPolygon = valid.length > 2 && first.lat === last.lat && first.lng === last.lng;
      const latlngs: [number, number][] = valid.map(v => [v.lat, v.lng]);
      if (isPolygon) {
        const polygon = L.polygon(latlngs, {
          color: '#ff4d4f',
          weight: 2,
          fillColor: '#ff4d4f',
          fillOpacity: 0.25,
        });
        layerGroupRef.current!.addLayer(polygon);
        mapRef.current!.fitBounds(polygon.getBounds(), { padding: [12, 12] });
      } else {
        const polyline = L.polyline(latlngs, { color: '#ff4d4f', weight: 2 });
        layerGroupRef.current!.addLayer(polyline);
        mapRef.current!.fitBounds(polyline.getBounds(), { padding: [12, 12] });
      }
    }
  }, [geometry?.coordinates, center?.lat, center?.lng]);

  useEffect(() => () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, []);

  return <div ref={divRef} style={{ width: '100%', height }} />;
};

export default MapView;
