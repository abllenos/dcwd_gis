import { makeAutoObservable, runInAction } from 'mobx';
import { apiGis } from '../components/endpoints/Interceptor';
import type { LogRecord, LayerOption, DebugStatus } from './logTypes';
import { defaultLayerOptions, parseMaybeJson, preferredPaths, tryKeys, deepFindArray, mapToLogRecord } from './logUtils';

export class LogStore {
  layerOptions: LayerOption[] = [];
  selectedLayer: number | undefined = 1;
  pageSize = 10;
  currentPage = 1;
  search = '';
  pageJumpInput = 1;
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
  totalCount: number | null = null; // legacy endpoint often lacks totals
  backgroundLoading = false; // no background paging in old flow
  // Keep this for layer-wide search store; not used for paging here
  readonly apiFetchPageSize = 1000;

  constructor() {
    makeAutoObservable(this, {
      apiFetchPageSize: false,
      // backgroundLoading is observable
    });
    this.initLayerOptions();
    // Initial fetch (single request)
    void this.fetchLogs();
  }

  initLayerOptions() {
    // Accurate list based on API-References.md (1-30)
    this.layerOptions = defaultLayerOptions;
  }

  setLayer(layer?: number) {
    this.selectedLayer = layer;
    this.currentPage = 1;
    this.pageJumpInput = 1;
    void this.fetchLogs();
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.pageJumpInput = 1;
    // Server-side pagination: fetch first page with new size
    void this.fetchLogs();
  }

  setPage(page: number) {
    const target = this.clampPage(page);
    this.currentPage = target;
    this.pageJumpInput = target;
    // Server-side pagination: fetch selected page
    void this.fetchLogs();
  }

  // Combined update to avoid double fetch when both page & size change from Table pagination event
  updatePagination(page: number, size: number) {
    this.pageSize = size;
    const target = this.clampPage(page);
    this.currentPage = target;
    this.pageJumpInput = target;
    // Server-side pagination: fetch given page/size
    void this.fetchLogs();
    return { sizeChanged: false };
  }

  setSearch(q: string) {
    this.search = q;
    this.currentPage = 1;
    this.pageJumpInput = 1;
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

  get pagedData(): LogRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    const total = this.totalCount;
    if (typeof total === 'number' && Number.isFinite(total) && total > 0) {
      return Math.max(1, Math.ceil(total / this.pageSize));
    }
    // Fallback when API doesn't return totals: ensure at least current page is reachable
    return Math.max(1, this.currentPage);
  }

  setPageJumpInput(value: number | null) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      this.pageJumpInput = this.currentPage;
      return;
    }
    this.pageJumpInput = this.clampPage(value);
  }

  jumpToPage() {
    const target = this.clampPage(this.pageJumpInput);
    if (target !== this.currentPage) {
      this.updatePagination(target, this.pageSize);
    } else {
      this.pageJumpInput = target;
    }
  }

  private clampPage(value: number) {
    if (!Number.isFinite(value)) return 1;
    const total = this.totalPages;
    const v = Math.floor(value);
    if (total <= 0) return 1;
    if (v < 1) return 1;
    if (v > total) return total;
    return v;
  }

  async fetchLogs() {
    runInAction(() => {
      this.loading = true;
      this.error = null;
      this.debugStatus = 'loading';
      this.lastErrorCode = null;
      this.lastErrorMessage = null;
      this.backgroundLoading = false;
      // keep existing totalCount until new response arrives
    });
    try {
      const layerId = this.selectedLayer ?? 1;
      const path = 'admin/logtrails/get';
      const base = (apiGis.defaults.baseURL ?? '').replace(/\/$/, '');
      const pageIndex = this.currentPage;
      const pageSize = this.pageSize;
      const fullUrl = `${base}/${path}?LayerID=${layerId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
      const resp = await apiGis.get(path, {
        params: { LayerID: layerId, PageIndex: pageIndex, PageSize: pageSize },
        headers: { Accept: 'text/plain' },
      });
      const { status, headers } = resp as { status?: number; headers?: Record<string, string> };
      const payload: unknown = parseMaybeJson(resp.data as unknown);

      const reqObj = (resp as unknown as { request?: { responseURL?: string } }).request;
      const effectiveUrl = reqObj?.responseURL || (resp as { config?: { url?: string } }).config?.url || fullUrl;

      runInAction(() => {
        this.lastStatus = status ?? null;
        this.lastContentType = headers?.['content-type'] ?? headers?.['Content-Type'] ?? null;
        this.lastCurl = `curl -X 'GET' '${fullUrl}' -H 'accept: text/plain'`;
        this.lastEffectiveUrl = effectiveUrl;
        this.lastRequestParams = { LayerID: layerId };
        this.rawPayloadType = Array.isArray(payload) ? 'array' : typeof payload;
        this.rawPayloadLength = typeof payload === 'string' ? payload.length : (Array.isArray(payload) ? payload.length : null);
        this.payloadKeys = payload && typeof payload === 'object' && !Array.isArray(payload) ? Object.keys(payload) : null;
      });

      const appStatus = Number((payload && typeof payload === 'object' ? (payload as { statusCode?: number | string }).statusCode : undefined));
      if (!Number.isNaN(appStatus) && appStatus >= 400) {
        runInAction(() => {
          this.data = [];
          this.error = null;
          this.lastSource = 'api';
          this.lastFetchedAt = new Date().toISOString();
          this.lastUrl = fullUrl;
          this.lastCount = 0;
          this.listKeyPath = null;
          this.sampleItemKeys = null;
          this.debugStatus = 'empty';
          this.backgroundLoading = false;
          this.totalCount = 0;
        });
        return;
      }

      // Attempt to use the new paginated envelope: payload.data.{ data:[], count, totalCount, pageIndex, pageSize }
      let list: unknown[] = [];
      let usedPath: string | null = null;
      let total: number | null = null;
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        const outer = payload as Record<string, unknown>;
        const dataNode = outer.data as Record<string, unknown> | undefined;
        const candidateList = dataNode?.data as unknown;
        if (Array.isArray(candidateList)) {
          list = candidateList as unknown[];
          usedPath = 'data.data';
          const c1 = Number((dataNode as { count?: unknown } | undefined)?.count);
          const c2 = Number((dataNode as { totalCount?: unknown } | undefined)?.totalCount);
          total = !Number.isNaN(c1) && c1 > 0 ? c1 : (!Number.isNaN(c2) && c2 > 0 ? c2 : null);
        }
      }
      // Fallbacks: accept root array or other known shapes if envelope absent
      if (!Array.isArray(list) || list.length === 0) {
        if (Array.isArray(payload)) {
          list = payload; usedPath = '(rootArray)';
        } else if (payload && typeof payload === 'object') {
          const r = tryKeys(payload as Record<string, unknown>, preferredPaths);
          list = r.list; usedPath = r.path;
          if ((!Array.isArray(list) || list.length === 0)) {
            const d = deepFindArray(payload as Record<string, unknown>, 4, []);
            if (Array.isArray(d.list)) { list = d.list; usedPath = d.path; }
          }
        }
      }

      if (!Array.isArray(list) || list.length === 0) {
        runInAction(() => {
          this.data = [];
          this.error = null;
          this.lastSource = 'api';
          this.lastFetchedAt = new Date().toISOString();
          this.lastUrl = fullUrl;
          this.lastCount = 0;
          this.lastCurl = `curl -X 'GET' '${fullUrl}' -H 'accept: text/plain'`;
          this.listKeyPath = usedPath;
          this.sampleItemKeys = null;
          this.debugStatus = 'empty';
          this.backgroundLoading = false;
          this.totalCount = total ?? 0;
        });
        return;
      }

      const layerLabel = this.layerOptions.find(o => o.value === this.selectedLayer)?.label ?? 'LAYER';
      const records = (list as unknown[]).map((it, idx): LogRecord => (
        mapToLogRecord(it as Record<string, unknown>, idx, layerLabel)
      ));

      runInAction(() => {
        this.data = records;
        this.lastSource = 'api';
        this.lastFetchedAt = new Date().toISOString();
        this.lastUrl = fullUrl;
        this.lastCount = records.length;
        this.listKeyPath = usedPath;
        try {
          const first = (Array.isArray(list) && list.length > 0 ? list[0] : null) as unknown;
          this.sampleItemKeys = (first && typeof first === 'object') ? Object.keys(first as object) : null;
        } catch { this.sampleItemKeys = null; }
        this.debugStatus = 'ok';
        this.backgroundLoading = false;
        this.totalCount = total;
        this.pageJumpInput = this.currentPage;
      });
    } catch (err: unknown) {
      const maybeResp = (err as { response?: { status?: number; headers?: Record<string, string> } }).response;
      const status = maybeResp?.status;
      const hasResponse = !!maybeResp;
      const maybeMessage = (err as { message?: string }).message;
      const layerId = this.selectedLayer ?? 1;
      const base = (apiGis.defaults.baseURL ?? '').replace(/\/$/, '');
      const fullUrl = `${base}/admin/logtrails/get?LayerID=${layerId}`;
      runInAction(() => {
        this.error = hasResponse ? null : (maybeMessage ?? 'Failed to reach API');
        this.data = [];
        this.lastSource = hasResponse ? 'api' : 'error';
        this.lastFetchedAt = new Date().toISOString();
        this.lastUrl = fullUrl;
        this.lastCount = 0;
        this.lastCurl = `curl -X 'GET' '${fullUrl}' -H 'accept: text/plain'`;
        this.debugStatus = hasResponse ? 'empty' : 'disconnected';
        this.lastStatus = hasResponse ? (status ?? null) : null;
        const headers = maybeResp?.headers as Record<string, string> | undefined;
        this.lastContentType = hasResponse ? (headers?.['content-type'] ?? headers?.['Content-Type'] ?? null) : null;
        const maybeCode = (err as { code?: string | number }).code;
        this.lastErrorCode = hasResponse ? null : (typeof maybeCode !== 'undefined' ? String(maybeCode) : null);
        this.lastErrorMessage = hasResponse ? null : (maybeMessage ?? null);
        this.backgroundLoading = false;
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }
  // Background fetch moved to helper
}

export const logStore = new LogStore();
