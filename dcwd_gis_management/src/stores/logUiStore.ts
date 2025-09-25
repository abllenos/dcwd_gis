import { makeAutoObservable, runInAction } from 'mobx';
import type { LogRecord } from './logTypes';
import { apiGis } from '../components/endpoints/Interceptor';
import { parseMaybeJson } from './logUtils';
import { formatAssetId } from '../utils/formatters';

class LogUiStore {
  isModalOpen = false;
  selected: LogRecord | null = null;
  geometry: { coordinates: { lat: number; lng: number }[] } | null = null;
  geometryLoading = false;
  geometryError: string | null = null;
  lastGeometryUrl: string | null = null;
  lastGeometryStatus: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  open(record: LogRecord) {
    runInAction(() => {
      this.selected = record;
      this.isModalOpen = true;
      this.geometry = null;
      this.geometryError = null;
      this.geometryLoading = false;
      this.lastGeometryUrl = null;
      this.lastGeometryStatus = null;
    });
    void this.fetchGeometry(record);
  }

  close() {
    runInAction(() => {
      this.isModalOpen = false;
      this.selected = null;
      this.geometry = null;
      this.geometryLoading = false;
      this.geometryError = null;
      this.lastGeometryUrl = null;
      this.lastGeometryStatus = null;
    });
  }

  private geoJsonToCoordinates(gj: unknown): { lat: number; lng: number }[] {
    if (!gj || typeof gj !== 'object') return [];
    const obj = gj as { type?: string; coordinates?: unknown };
    const t = String(obj.type || '');
    const c = obj.coordinates as unknown;
    const toLL = (xy: unknown): { lat: number; lng: number } | null => {
      if (!Array.isArray(xy) || xy.length < 2) return null;
      const [lng, lat] = xy as [number, number];
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat: Number(lat), lng: Number(lng) };
      return null;
    };
    if (t === 'Point') {
      const one = toLL(c);
      return one ? [one] : [];
    }
    if (t === 'LineString' && Array.isArray(c)) {
      return (c as unknown[]).map(toLL).filter(Boolean) as { lat: number; lng: number }[];
    }
    if (t === 'Polygon' && Array.isArray(c)) {
      const rings = c as unknown[];
      const outer = Array.isArray(rings[0]) ? (rings[0] as unknown[]) : [];
      return outer.map(toLL).filter(Boolean) as { lat: number; lng: number }[];
    }
    // Minimal Multi* support: flatten first part
    if ((t === 'MultiPoint' || t === 'MultiLineString' || t === 'MultiPolygon') && Array.isArray(c)) {
      const first = (c as unknown[])[0];
      if (Array.isArray(first)) {
        if (t === 'MultiPoint') return (first as unknown[]).map(toLL).filter(Boolean) as { lat: number; lng: number }[];
        if (t === 'MultiLineString') return (first as unknown[]).map(toLL).filter(Boolean) as { lat: number; lng: number }[];
        if (t === 'MultiPolygon') {
          const outer = Array.isArray((first as unknown[])[0]) ? ((first as unknown[])[0] as unknown[]) : [];
          return outer.map(toLL).filter(Boolean) as { lat: number; lng: number }[];
        }
      }
    }
    return [];
  }

  async fetchGeometry(record: LogRecord) {
    runInAction(() => {
      this.geometryLoading = true;
      this.geometryError = null;
      this.geometry = null;
    });
    const LogID = record.id;
    const LayerID = record.layerId; // already trimmed; includes DCWD_ prefix
    const assetStr = formatAssetId(record.assetId);
    const AssetID = Number.isFinite(Number(assetStr)) ? Number(assetStr) : assetStr;
    const path = 'helpers/gis/api/UserLogs/getLogsGeometry.php';
    const params = { LogID, LayerID, AssetID } as const;
    try {
      const resp = await apiGis.get(path, {
        params,
        headers: { Accept: 'application/json,text/plain;q=0.9' },
        // Ensure dev uses local proxy (blank baseURL) & treat as public (no auth header)
        useLocalProxy: true,
        skipAuth: true,
      } as any);
      runInAction(() => {
        this.lastGeometryUrl = `${apiGis.defaults.baseURL?.replace(/\/$/, '')}/${path}?` + new URLSearchParams({ LogID: String(LogID), LayerID: String(LayerID), AssetID: String(AssetID) }).toString();
        this.lastGeometryStatus = resp.status ?? null;
      });
      if (resp.status && resp.status >= 400) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const body = parseMaybeJson(resp.data);
      // Try common wrappers: { data: { st_asgeojson: '...json...' } }
      let geoStr: unknown;
      if (body && typeof body === 'object') {
        const d = (body as { data?: unknown }).data;
        if (d && typeof d === 'object' && 'st_asgeojson' in (d as object)) {
          geoStr = (d as { st_asgeojson?: unknown }).st_asgeojson;
        } else if ('st_asgeojson' in (body as object)) {
          geoStr = (body as { st_asgeojson?: unknown }).st_asgeojson;
        }
      }
      const geoObj = typeof geoStr === 'string' ? parseMaybeJson(geoStr) : geoStr;
      const coords = this.geoJsonToCoordinates(geoObj);
      if (coords.length === 0) {
        runInAction(() => {
          this.geometryError = 'No geometry available for this log.';
          this.geometry = null;
        });
      } else {
        runInAction(() => {
          this.geometry = { coordinates: coords };
        });
      }
    } catch (e) {
      // One light retry (network glitch) if we have not yet retried
      if (!(e as { __retried?: boolean }).__retried) {
        try {
          (e as { __retried?: boolean }).__retried = true;
          const retryResp = await apiGis.get(path, {
            params,
            headers: { Accept: 'application/json,text/plain;q=0.9' },
          });
          runInAction(() => { this.lastGeometryStatus = retryResp.status ?? null; });
          const body2 = parseMaybeJson(retryResp.data);
          let geoStr2: unknown;
          if (body2 && typeof body2 === 'object') {
            const d2 = (body2 as { data?: unknown }).data;
            if (d2 && typeof d2 === 'object' && 'st_asgeojson' in (d2 as object)) {
              geoStr2 = (d2 as { st_asgeojson?: unknown }).st_asgeojson;
            } else if ('st_asgeojson' in (body2 as object)) {
              geoStr2 = (body2 as { st_asgeojson?: unknown }).st_asgeojson;
            }
          }
          const geoObj2 = typeof geoStr2 === 'string' ? parseMaybeJson(geoStr2) : geoStr2;
          const coords2 = this.geoJsonToCoordinates(geoObj2);
          if (coords2.length > 0) {
            runInAction(() => {
              this.geometry = { coordinates: coords2 };
              this.geometryError = null;
              this.geometryLoading = false;
            });
            return;
          }
        } catch { /* swallow retry error */ }
      }
      const msg = (e as { message?: string }).message || 'Failed to load geometry.';
      runInAction(() => {
        this.geometryError = msg;
        this.geometry = null;
      });
    } finally {
      runInAction(() => { this.geometryLoading = false; });
    }
  }
}

export const logUiStore = new LogUiStore();
