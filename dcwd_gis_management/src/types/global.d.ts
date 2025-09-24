import MapAPI from '../services/MapAPI';

declare global {
  interface Window {
    MapAPI: typeof MapAPI;
  }
}

export {};