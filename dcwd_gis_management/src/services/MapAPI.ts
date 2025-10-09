import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',

});

export interface MapOptions {
  center?: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  zoomControl?: boolean;
}

export interface MarkerData {
  id: string;
  position: [number, number];
  title?: string;
  description?: string;
  icon?: L.Icon;
}

export interface LayerData {
  id: string;
  name: string;
  url: string;
  options?: L.TileLayerOptions;
}

export interface DavaoLocation {
  id: string;
  name: string;
  type: 'water_facility' | 'service_area' | 'landmark' | 'office' | 'maintenance';
  position: [number, number];
  description?: string;
  properties?: Record<string, any>;
}

export const DAVAO_TILE_LAYERS = {
  googleMaps: {
    name: 'Google Maps',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    options: {
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }
  },
  googleSatellite: {
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    options: {
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }
  },
  googleHybrid: {
    name: 'Google Hybrid',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: {
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }
  },
  googleTerrain: {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    options: {
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }
  }
};

export const DAVAO_WATER_FACILITIES: DavaoLocation[] = [
  {
    id: 'dcwd-main',
    name: 'DCWD Main Office',
    type: 'office',
    position: [7.0711, 125.6143],
    description: 'Davao City Water District Main Office',
    properties: { department: 'Administration', capacity: '200 employees' }
  },
  {
    id: 'talomo-treatment',
    name: 'Talomo Water Treatment Plant',
    type: 'water_facility',
    position: [7.0392, 125.5789],
    description: 'Primary water treatment facility serving southern Davao',
    properties: { capacity: '50,000 cubic meters/day', status: 'operational' }
  },
  {
    id: 'panawan-treatment',
    name: 'Panawan Water Treatment Plant',
    type: 'water_facility',
    position: [7.1234, 125.6543],
    description: 'Water treatment plant serving northern districts',
    properties: { capacity: '30,000 cubic meters/day', status: 'operational' }
  },
  {
    id: 'davao-river-intake',
    name: 'Davao River Water Intake',
    type: 'water_facility',
    position: [7.0654, 125.6087],
    description: 'Primary water source intake point',
    properties: { source: 'Davao River', type: 'intake' }
  },
  {
    id: 'poblacion-service',
    name: 'Poblacion Service Area',
    type: 'service_area',
    position: [7.0731, 125.6128],
    description: 'Central business district water service coverage',
    properties: { households: '15000', district: 'Poblacion' }
  },
  {
    id: 'buhangin-service',
    name: 'Buhangin Service Area',
    type: 'service_area',
    position: [7.1089, 125.6289],
    description: 'Buhangin district water service coverage',
    properties: { households: '12000', district: 'Buhangin' }
  },
  {
    id: 'maintenance-depot',
    name: 'Central Maintenance Depot',
    type: 'maintenance',
    position: [7.0856, 125.6201],
    description: 'Main equipment and vehicle maintenance facility',
    properties: { vehicles: '25', equipment_types: ['pumps', 'pipes', 'meters'] }
  }
];

class MapAPI {
  private maps: Map<string, L.Map> = new Map();
  private markers: Map<string, Map<string, L.Marker>> = new Map();
  private layers: Map<string, Map<string, L.TileLayer>> = new Map();

  /**
   * Initialize a new map instance
   */
  createMap(containerId: string, options: MapOptions = {}): L.Map {
    const defaultOptions: MapOptions = {
      center: [7.0731, 125.6128], // Davao City center coordinates
      zoom: 14,
      scrollWheelZoom: true,
      zoomControl: true,
    };

    const mapOptions = { ...defaultOptions, ...options };

    // Define Davao City bounds (more restrictive to city proper only)
    const davaoBounds: L.LatLngBounds = L.latLngBounds(
      [6.9600, 125.4800], // Southwest corner - Davao City proper
      [7.2000, 125.7000]  // Northeast corner - Davao City proper
    );

    const map = L.map(containerId, {
      center: mapOptions.center!,
      zoom: mapOptions.zoom!,
      scrollWheelZoom: mapOptions.scrollWheelZoom!,
      zoomControl: mapOptions.zoomControl!,
      maxBounds: davaoBounds,
      maxBoundsViscosity: 1.0, // Prevents panning outside bounds
      minZoom: 12, // Higher minimum zoom to keep focus strictly on Davao City
      maxZoom: 18  // Maximum zoom for detailed view
    });

    // Add default tile layer (Google Maps for cleaner appearance)
    L.tileLayer(DAVAO_TILE_LAYERS.googleMaps.url, DAVAO_TILE_LAYERS.googleMaps.options).addTo(map);

    // Restrict map bounds to Davao City
    this.restrictToDavaoCity(containerId, map);

    // Store the map instance
    this.maps.set(containerId, map);
    this.markers.set(containerId, new Map());
    this.layers.set(containerId, new Map());

    return map;
  }

  /**
   * Get an existing map instance
   */
  getMap(containerId: string): L.Map | undefined {
    return this.maps.get(containerId);
  }

  /**
   * Add a marker to the map
   */
  addMarker(mapId: string, markerData: MarkerData): L.Marker | null {
    const map = this.maps.get(mapId);
    if (!map) {
      console.warn(`Map with id "${mapId}" not found`);
      return null;
    }

    const marker = L.marker(markerData.position, {
      icon: markerData.icon || new L.Icon.Default(),
    }).addTo(map);

    if (markerData.title || markerData.description) {
      const popupContent = `
        ${markerData.title ? `<h4>${markerData.title}</h4>` : ''}
        ${markerData.description ? `<p>${markerData.description}</p>` : ''}
      `;
      marker.bindPopup(popupContent);
    }

    // Store the marker
    const mapMarkers = this.markers.get(mapId);
    if (mapMarkers) {
      mapMarkers.set(markerData.id, marker);
    }

    return marker;
  }

  /**
   * Remove a marker from the map
   */
  removeMarker(mapId: string, markerId: string): boolean {
    const mapMarkers = this.markers.get(mapId);
    if (!mapMarkers) return false;

    const marker = mapMarkers.get(markerId);
    if (!marker) return false;

    marker.remove();
    mapMarkers.delete(markerId);
    return true;
  }

  /**
   * Clear all markers from the map
   */
  clearMarkers(mapId: string): void {
    const mapMarkers = this.markers.get(mapId);
    if (!mapMarkers) return;

    mapMarkers.forEach((marker) => marker.remove());
    mapMarkers.clear();
  }

  /**
   * Add a custom tile layer to the map
   */
  addLayer(mapId: string, layerData: LayerData): L.TileLayer | null {
    const map = this.maps.get(mapId);
    if (!map) {
      console.warn(`Map with id "${mapId}" not found`);
      return null;
    }

    const layer = L.tileLayer(layerData.url, layerData.options).addTo(map);

    // Store the layer
    const mapLayers = this.layers.get(mapId);
    if (mapLayers) {
      mapLayers.set(layerData.id, layer);
    }

    return layer;
  }

  /**
   * Remove a layer from the map
   */
  removeLayer(mapId: string, layerId: string): boolean {
    const mapLayers = this.layers.get(mapId);
    if (!mapLayers) return false;

    const layer = mapLayers.get(layerId);
    if (!layer) return false;

    layer.remove();
    mapLayers.delete(layerId);
    return true;
  }

  /**
   * Set the map view (center and zoom)
   */
  setView(mapId: string, center: [number, number], zoom: number, animate: boolean = true): boolean {
    const map = this.maps.get(mapId);
    if (!map) return false;

    if (animate) {
      // Smooth animated zoom to location
      map.setView(center, zoom, {
        animate: true,
        duration: 1.5, // 1.5 seconds animation
        easeLinearity: 0.25
      });
    } else {
      map.setView(center, zoom);
    }
    return true;
  }

  /**
   * Fit the map view to show all markers
   */
  fitToMarkers(mapId: string): boolean {
    const map = this.maps.get(mapId);
    const mapMarkers = this.markers.get(mapId);
    
    if (!map || !mapMarkers || mapMarkers.size === 0) return false;

    const group = new L.FeatureGroup(Array.from(mapMarkers.values()));
    map.fitBounds(group.getBounds(), { padding: [10, 10] });
    return true;
  }

  /**
   * Destroy a map instance and clean up resources
   */
  destroyMap(containerId: string): boolean {
    const map = this.maps.get(containerId);
    if (!map) return false;

    // Clear all markers and layers
    this.clearMarkers(containerId);
    const mapLayers = this.layers.get(containerId);
    if (mapLayers) {
      mapLayers.forEach((layer) => layer.remove());
      mapLayers.clear();
    }

    // Remove the map
    map.remove();
    this.maps.delete(containerId);
    this.markers.delete(containerId);
    this.layers.delete(containerId);

    return true;
  }

  /**
   * Get all map instances
   */
  getAllMaps(): Map<string, L.Map> {
    return new Map(this.maps);
  }

  /**
   * Create a custom icon
   */
  createIcon(iconUrl: string, options: Partial<L.IconOptions> = {}): L.Icon {
    return new L.Icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41],
      ...options,
    });
  }

  /**
   * Create a status marker (colored circle) for employee tracking with glowing effect
   */
  createStatusMarker(status: 'online' | 'offline' | 'unknown'): L.DivIcon {
    const colors = {
      online: '#00ff00',    // Green
      offline: '#ff0000',   // Red
      unknown: '#ffff00'    // Yellow
    };
    
    const color = colors[status] || '#0000ff'; // Blue as default
    const glowColor = color;

    return L.divIcon({
      html: `
        <div class="live-location-marker" style="
          position: relative;
          width: 24px;
          height: 24px;
        ">
          <!-- Outer glow rings for live effect -->
          <div class="glow-ring-outer" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 24px;
            height: 24px;
            background: radial-gradient(circle, ${glowColor} 0%, transparent 70%);
            border-radius: 50%;
            animation: blink-outer 4s infinite linear;
          "></div>
          <div class="glow-ring-inner" style="
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, ${glowColor} 0%, transparent 60%);
            border-radius: 50%;
            animation: blink-inner 4s infinite linear;
          "></div>
          <!-- Core location pin -->
          <div class="location-core" style="
            position: absolute;
            top: 6px;
            left: 6px;
            width: 12px;
            height: 12px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            animation: core-blink 4s infinite linear;
            z-index: 10;
          "></div>
        </div>
        <style>
          @keyframes blink-outer {
            0%, 45% {
              opacity: 0;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.4);
            }
            55%, 100% {
              opacity: 0;
              transform: scale(1.4);
            }
          }
          @keyframes blink-inner {
            0%, 20% {
              opacity: 0;
              transform: scale(1);
            }
            25% {
              opacity: 0.9;
              transform: scale(1.2);
            }
            30%, 65% {
              opacity: 0;
              transform: scale(1.2);
            }
            70% {
              opacity: 0.9;
              transform: scale(1.2);
            }
            75%, 100% {
              opacity: 0;
              transform: scale(1.2);
            }
          }
          @keyframes core-blink {
            0%, 40% {
              box-shadow: 0 0 8px rgba(0,0,0,0.3), 0 0 16px ${color}40;
            }
            45% {
              box-shadow: 0 0 12px rgba(0,0,0,0.5), 0 0 24px ${color}80, 0 0 32px ${color}60;
            }
            50%, 65% {
              box-shadow: 0 0 8px rgba(0,0,0,0.3), 0 0 16px ${color}40;
            }
            70% {
              box-shadow: 0 0 12px rgba(0,0,0,0.5), 0 0 24px ${color}80, 0 0 32px ${color}60;
            }
            75%, 100% {
              box-shadow: 0 0 8px rgba(0,0,0,0.3), 0 0 16px ${color}40;
            }
          }
          .live-location-marker {
            overflow: visible !important;
          }
        </style>
      `,
      className: 'employee-status-marker-glowing',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  /**
   * Add Davao water facilities to the map
   */
  addDavaoWaterFacilities(mapId: string, facilities: DavaoLocation[] = DAVAO_WATER_FACILITIES): void {
    facilities.forEach(facility => {
      const iconColor = this.getFacilityIconColor(facility.type);
      const icon = this.createFacilityIcon(facility.type, iconColor);
      
      this.addMarker(mapId, {
        id: facility.id,
        position: facility.position,
        title: facility.name,
        description: this.buildFacilityDescription(facility),
        icon: icon as any // TypeScript workaround for DivIcon vs Icon
      });
    });
  }

  /**
   * Switch tile layer for better area coverage
   */
  switchTileLayer(mapId: string, layerType: keyof typeof DAVAO_TILE_LAYERS): boolean {
    const map = this.maps.get(mapId);
    if (!map) return false;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer
    const layerConfig = DAVAO_TILE_LAYERS[layerType];
    L.tileLayer(layerConfig.url, layerConfig.options).addTo(map);
    
    return true;
  }

  /**
   * Focus on Davao city bounds
   */
  focusOnDavaoCity(mapId: string): boolean {
    const map = this.maps.get(mapId);
    if (!map) return false;

    // Davao City proper bounds (restricted to city only)
    const davaoBounds: [[number, number], [number, number]] = [
      [6.9600, 125.4800], // Southwest - Davao City proper
      [7.2000, 125.7000]  // Northeast - Davao City proper
    ];

    map.fitBounds(davaoBounds, { padding: [20, 20] });
    return true;
  }

  /**
   * Apply Davao City bounds restriction to an existing map
   */
  applyDavaoCityBounds(mapId: string): boolean {
    const map = this.maps.get(mapId);
    if (!map) return false;

    this.restrictToDavaoCity(mapId, map);
    return true;
  }

  /**
   * Restrict map navigation to Davao City bounds only
   */
  private restrictToDavaoCity(_mapId: string, map: L.Map): void {
    const davaoBounds = L.latLngBounds(
      [6.9600, 125.4800], // Southwest corner - Davao City proper
      [7.2000, 125.7000]  // Northeast corner - Davao City proper
    );

    // Set max bounds to prevent panning outside Davao City
    map.setMaxBounds(davaoBounds);

    // Add event listeners to enforce bounds
    map.on('drag', () => {
      map.panInsideBounds(davaoBounds, { animate: false });
    });

    map.on('zoomend', () => {
      if (!davaoBounds.contains(map.getCenter())) {
        map.panTo(davaoBounds.getCenter());
      }
    });

    // Initial check to ensure map is within bounds
    if (!davaoBounds.contains(map.getCenter())) {
      map.setView(davaoBounds.getCenter(), map.getZoom());
    }
  }

  /**
   * Get facility icon color based on type
   */
  private getFacilityIconColor(type: DavaoLocation['type']): string {
    const colors = {
      water_facility: '#2196F3',   // Blue
      service_area: '#4CAF50',     // Green
      landmark: '#FF9800',         // Orange
      office: '#9C27B0',           // Purple
      maintenance: '#F44336'       // Red
    };
    return colors[type] || '#757575';
  }

  /**
   * Create facility-specific icon
   */
  private createFacilityIcon(type: DavaoLocation['type'], color: string): L.DivIcon {
    const icons = {
      water_facility: '💧',
      service_area: '🏘️',
      landmark: '📍',
      office: '🏢',
      maintenance: '🔧'
    };

    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        font-size: 12px;
      ">${icons[type] || '📍'}</div>`,
      className: 'davao-facility-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  /**
   * Build facility description with properties
   */
  private buildFacilityDescription(facility: DavaoLocation): string {
    let description = facility.description || '';
    
    if (facility.properties) {
      description += '<br><br><strong>Details:</strong><br>';
      Object.entries(facility.properties).forEach(([key, value]) => {
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        description += `• ${displayKey}: ${value}<br>`;
      });
    }
    
    return description;
  }
}

// Create a singleton instance
const mapAPI = new MapAPI();

// Make it globally available
(window as any).MapAPI = mapAPI;

export default mapAPI;