import { makeAutoObservable } from 'mobx';
import { devApi } from '../components/endpoints/Interceptor';
import type { LogRecord, LayerOption, DebugStatus } from './logTypes';
import {
  defaultLayerOptions,
  parseMaybeJson,
  preferredPaths,
  tryKeys,
  deepFindArray,
  mapToLogRecord,
} from './logUtils';

export class LogStore {
  layerOptions: LayerOption[] = [];
  selectedLayer: number | undefined = 1;
  pageSize = 10;
  currentPage = 1;
  // Server-side paging: currentPage will be sent as PageIndex; pageSize as PageSize
  search = '';
  data: LogRecord[] = [];
  loading = false;
  error: string | null = null;
  lastUrl: string | null = null;
  lastSource: 'api' | 'error' | null = null;
  lastFetchedAt: string | null = null;
  lastCount = 0;
  lastCurl: string | null = null;
  lastStatus: number | null = null;
  lastContentType: string | null = null;
  rawPayloadType: string | null = null;
  rawPayloadLength: number | null = null;
  payloadKeys: string[] | null = null;
  lastEffectiveUrl: string | null = null;
  lastRequestParams: Record<string, unknown> | null = null;
  listKeyPath: string | null = null;
  sampleItemKeys: string[] | null = null;
  debugStatus: DebugStatus = null;
  lastErrorCode: string | null = null;
  lastErrorMessage: string | null = null;
  totalCount: number | null = null; // server-side total rows for selected layer

  constructor() {
    makeAutoObservable(this);
    this.initLayerOptions();
    // Attempt initial fetch; fallback to local generator on failure
    this.fetchLogs();
  }

  initLayerOptions() {
    // Accurate list based on API-References.md (1-30)
    this.layerOptions = defaultLayerOptions;
  }

  setLayer(layer?: number) {
    this.selectedLayer = layer;
    this.currentPage = 1;
    this.fetchLogs();
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    // Fetch immediately for server-side paging
    void this.fetchLogs();
  }

  setPage(page: number) {
    this.currentPage = page;
    void this.fetchLogs();
  }

  // Combined update to avoid double fetch when both page & size change from Table pagination event
  updatePagination(page: number, size: number) {
    const sizeChanged = size !== this.pageSize;
    this.pageSize = size;
    this.currentPage = page;
    void this.fetchLogs();
    return { sizeChanged };
  }

  setSearch(q: string) {
    this.search = q;
    this.currentPage = 1;
  }

  get filteredData(): LogRecord[] {
    const q = this.search.trim().toLowerCase();
    const base = this.data;
    if (!q) return base;
    return base.filter(r =>
      String(r.id).includes(q) ||
      r.layerId.toLowerCase().includes(q) ||
      r.assetId.toLowerCase().includes(q) ||
      r.modifiedBy.toLowerCase().includes(q) ||
      r.accessFlag.toLowerCase().includes(q) ||
      r.dateTime.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }

  async fetchLogs() {
    this.loading = true;
    this.error = null;
    this.debugStatus = 'loading';
    this.lastErrorCode = null;
    this.lastErrorMessage = null;
    try {
      const layerId = this.selectedLayer ?? 1;
      const path = 'admin/logtrails/get';
      const base = (devApi.defaults.baseURL ?? '').replace(/\/$/, '');
      const pageIndex = this.currentPage;
      const fullUrl = `${base}/${path}?LayerID=${layerId}&PageIndex=${pageIndex}&PageSize=${this.pageSize}`;
    // request start
      const resp = await devApi.get(path, {
        params: { LayerID: layerId, PageIndex: pageIndex, PageSize: this.pageSize },
        headers: { Accept: 'text/plain' },
      });
    const { status, headers } = resp;
    const data: unknown = resp.data;
      this.lastStatus = status ?? null;
      this.lastContentType = headers?.['content-type'] ?? headers?.['Content-Type'] ?? null;
      this.lastCurl = `curl -X 'GET' '${fullUrl}' -H 'accept: text/plain'`;
    const reqObj = (resp as unknown as { request?: { responseURL?: string } }).request;
      this.lastEffectiveUrl = reqObj?.responseURL || resp.config?.url || fullUrl;
      this.lastRequestParams = { LayerID: layerId, PageIndex: pageIndex, PageSize: this.pageSize };

    // Normalize response to LogRecord[]
    const payload: unknown = parseMaybeJson(data);

      this.rawPayloadType = Array.isArray(payload) ? 'array' : typeof payload;
      this.rawPayloadLength = typeof payload === 'string' ? payload.length : (Array.isArray(payload) ? payload.length : null);
      this.payloadKeys = payload && typeof payload === 'object' && !Array.isArray(payload) ? Object.keys(payload) : null;

      // If API includes a statusCode in body and it's an app-level error, treat as connected but no data
      const appStatus = Number((payload && typeof payload === 'object' ? (payload as { statusCode?: number | string }).statusCode : undefined));
      if (!Number.isNaN(appStatus) && appStatus >= 400) {
        this.data = [];
        this.error = null; // show No Data Found instead of error banner
        this.lastSource = 'api';
        this.lastFetchedAt = new Date().toISOString();
        this.lastUrl = fullUrl;
        this.lastCount = 0;
        this.listKeyPath = null;
        this.sampleItemKeys = null;
        this.debugStatus = 'empty';
        this.lastErrorCode = null;
        this.lastErrorMessage = null;
        return;
      }

      // Extract paging meta if present (shape: { data: { pageIndex,pageSize,count,totalCount,data:[...] } })
      let serverCount: number | null = null;
      if (payload && typeof payload === 'object') {
        const outer = payload as Record<string, unknown>;
        const inner = outer.data as Record<string, unknown> | undefined;
        if (inner && typeof inner === 'object') {
          const c1 = Number((inner as { count?: unknown }).count);
            if (!Number.isNaN(c1) && c1 > 0) serverCount = c1;
          const c2 = Number((inner as { totalCount?: unknown }).totalCount);
            if (serverCount === null && !Number.isNaN(c2) && c2 > 0) serverCount = c2;
        }
      }

      // use helpers for preferred paths and deep search to find the list

      let list: unknown[] = [];
      let usedPath: string | null = null;
      if (Array.isArray(payload)) {
        list = payload; usedPath = '(rootArray)';
      } else if (payload && typeof payload === 'object') {
        const r = tryKeys(payload as Record<string, unknown>, preferredPaths);
        list = r.list; usedPath = r.path;
        if ((!Array.isArray(list) || list.length === 0)) {
          // deep scan for arrays up to depth 4
          const d = deepFindArray(payload as Record<string, unknown>, 4, []);
          if (Array.isArray(d.list)) { list = d.list; usedPath = d.path; }
        }
      }

      if (!Array.isArray(list) || list.length === 0) {
        // No data from API; do not fallback as requested
        this.data = [];
        this.error = null; // treat as non-error: show table empty state
        this.lastSource = 'api';
        this.lastFetchedAt = new Date().toISOString();
        this.lastUrl = fullUrl;
        this.lastCount = 0;
        this.totalCount = serverCount ?? 0;
        this.lastCurl = `curl -X 'GET' '${fullUrl}' -H 'accept: text/plain'`;
        this.listKeyPath = usedPath;
        this.sampleItemKeys = null;
        this.debugStatus = 'empty';
        return;
      }

    const layerLabel = this.layerOptions.find(o => o.value === this.selectedLayer)?.label ?? 'LAYER';

    this.data = (list as unknown[]).map((it, idx): LogRecord => mapToLogRecord(it as Record<string, unknown>, idx, layerLabel));
      this.lastSource = 'api';
      this.lastFetchedAt = new Date().toISOString();
      this.lastUrl = fullUrl;
      this.lastCount = this.data.length;
      this.totalCount = serverCount ?? this.totalCount ?? (this.currentPage === 1 ? this.data.length : null);
      this.listKeyPath = usedPath;
      // capture raw item keys for diagnostics if available
      try {
        const first = (Array.isArray(list) && list.length > 0 ? list[0] : null) as unknown;
        this.sampleItemKeys = (first && typeof first === 'object') ? Object.keys(first as object) : null;
      } catch { this.sampleItemKeys = null; }
      this.debugStatus = 'ok';
    } catch (err: unknown) {
      // Narrow potential axios error shape without importing axios types here
      const maybeResp = (err as { response?: { status?: number; headers?: Record<string, string> } }).response;
      const status = maybeResp?.status;
      // Decide whether to show error (disconnected) or treat as no data (reachable but HTTP error)
      const hasResponse = !!maybeResp;
      const maybeMessage = (err as { message?: string }).message;
      this.error = hasResponse ? null : (maybeMessage ?? 'Failed to reach API');
      // No fallback; clear data
      this.data = [];
      const layerId = this.selectedLayer ?? 1;
      const base = (devApi.defaults.baseURL ?? '').replace(/\/$/, '');
  const fullUrl = `${base}/admin/logtrails/get?LayerID=${layerId}&PageIndex=${this.currentPage}&PageSize=${this.pageSize}`;
      this.lastSource = hasResponse ? 'api' : 'error';
      this.lastFetchedAt = new Date().toISOString();
      this.lastUrl = fullUrl;
      this.lastCount = 0;
  this.totalCount = 0;
      this.lastCurl = `curl -X 'GET' '${fullUrl}' -H 'accept: text/plain'`;
      // Distinguish disconnected vs HTTP error
      this.debugStatus = hasResponse ? 'empty' : 'disconnected';
      this.lastStatus = hasResponse ? (status ?? null) : null;
      const headers = maybeResp?.headers as Record<string, string> | undefined;
      this.lastContentType = hasResponse ? (headers?.['content-type'] ?? headers?.['Content-Type'] ?? null) : null;
      const maybeCode = (err as { code?: string | number }).code;
      this.lastErrorCode = hasResponse ? null : (typeof maybeCode !== 'undefined' ? String(maybeCode) : null);
      this.lastErrorMessage = hasResponse ? null : (maybeMessage ?? null);
    } finally {
      this.loading = false;
    }
  }
}

export const logStore = new LogStore();
