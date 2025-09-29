import { makeAutoObservable, runInAction } from 'mobx';
import { devApi } from '../components/endpoints/Interceptor';
import { fetchRemainingPages as fetchRemainingPagesHelper } from './helpers/fetchRemainingPages';
import type { LogRecord, LayerOption, DebugStatus } from './logTypes';
import { fetchFirstPage } from './helpers/fetchFirstPage';
import { defaultLayerOptions } from './logUtils';

export class LogStore {
  layerOptions: LayerOption[] = [];
  selectedLayer: number | undefined = 1;
  pageSize = 10;
  currentPage = 1;
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
  backgroundLoading = false; // indicates background aggregation after first page
  // Aggregation controls
  readonly apiFetchPageSize = 1000; // ask nicely; server may cap
  readonly apiMaxPageIterations = 40000; // safety guard
  readonly commitBatchSize = 5000; // commit to observables every N rows
  layerDataCache = new Map<number, LogRecord[]>();
  layerTotalCache = new Map<number, number | null>();
  private fetchToken = 0;

  constructor() {
    makeAutoObservable(this, {
      apiFetchPageSize: false,
      apiMaxPageIterations: false,
      commitBatchSize: false,
      layerDataCache: false,
      layerTotalCache: false,
      // backgroundLoading is observable
    });
    this.initLayerOptions();
    // Initial fetch aggregates into cache
    void this.fetchLogs(true);
  }

  initLayerOptions() {
    // Accurate list based on API-References.md (1-30)
    this.layerOptions = defaultLayerOptions;
  }

  setLayer(layer?: number) {
    this.selectedLayer = layer;
    this.currentPage = 1;
    void this.fetchLogs();
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    // Local pagination; no fetch
  }

  setPage(page: number) {
    this.currentPage = page;
    // Local pagination; no fetch
  }

  // Combined update to avoid double fetch when both page & size change from Table pagination event
  updatePagination(page: number, size: number) {
    this.pageSize = size;
    this.currentPage = page;
    // Local pagination; no fetch
    return { sizeChanged: false };
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

  get pagedData(): LogRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  async fetchLogs(force = false) {
    const layerId = this.selectedLayer ?? 1;
    if (force) {
      this.layerDataCache.delete(layerId);
    }
    // Serve from cache if available
    if (!force && this.layerDataCache.has(layerId)) {
      const cached = this.layerDataCache.get(layerId) ?? [];
      const cachedTotal = this.layerTotalCache.get(layerId) ?? null;
      runInAction(() => {
        this.data = cached;
        this.totalCount = cachedTotal;
        this.lastCount = cached.length;
        this.debugStatus = cached.length ? 'ok' : 'empty';
        this.error = null;
        this.loading = false;
      });
      return;
    }

    this.loading = true;
    this.error = null;
    this.debugStatus = 'loading';
    this.lastErrorCode = null;
    this.lastErrorMessage = null;
    try {
      const fetchSize = this.apiFetchPageSize;
      const layerLabel = this.layerOptions.find(o => o.value === layerId)?.label ?? 'LAYER';
      ++this.fetchToken;

      // First page via helper
      const first = await fetchFirstPage({ layerId, fetchSize, layerLabel });
      this.lastStatus = first.diagnostics.lastStatus;
      this.lastContentType = first.diagnostics.lastContentType;
      this.lastCurl = first.diagnostics.lastCurl;
      this.lastEffectiveUrl = first.diagnostics.lastEffectiveUrl;
      this.lastRequestParams = first.diagnostics.lastRequestParams;
      this.rawPayloadType = first.diagnostics.rawPayloadType;
      this.rawPayloadLength = first.diagnostics.rawPayloadLength;
      this.payloadKeys = first.diagnostics.payloadKeys;
      this.lastUrl = first.diagnostics.lastUrl;

      if (first.appEmpty) {
          // Treat as connected but no data; commit empty and return
          runInAction(() => {
            this.data = [];
            this.layerDataCache.set(layerId, []);
            this.layerTotalCache.set(layerId, 0);
            this.lastSource = 'api';
            this.lastFetchedAt = new Date().toISOString();
            this.lastCount = 0;
            this.totalCount = 0;
            this.listKeyPath = null;
            this.sampleItemKeys = null;
            this.debugStatus = 'empty';
            this.loading = false;
            this.backgroundLoading = false;
          });
          return;
        }

        if (first.listEmpty) {
          // Commit empty and stop early
          runInAction(() => {
            this.data = [];
            this.layerDataCache.set(layerId, []);
            this.layerTotalCache.set(layerId, 0);
            this.lastSource = 'api';
            this.lastFetchedAt = new Date().toISOString();
            this.lastCount = 0;
            this.totalCount = 0;
            this.listKeyPath = first.usedPath;
            this.sampleItemKeys = first.sampleItemKeys;
            this.debugStatus = 'empty';
            this.loading = false;
            this.backgroundLoading = false;
          });
          return;
        }

        const aggregated = first.aggregated;
        runInAction(() => {
          this.data = [...aggregated];
          this.layerDataCache.set(layerId, [...aggregated]);
          this.layerTotalCache.set(layerId, first.totalExpected);
          this.lastSource = 'api';
          this.lastFetchedAt = new Date().toISOString();
          this.lastCount = aggregated.length;
          this.totalCount = first.totalExpected !== null ? Math.max(first.totalExpected, aggregated.length) : null;
          this.listKeyPath = first.usedPath;
          this.sampleItemKeys = first.sampleItemKeys;
          this.debugStatus = aggregated.length ? 'ok' : 'empty';
          this.loading = false; // allow UI interactions while background continues
          this.backgroundLoading = true; // signal background aggregation
        });
      

      // Continue loading remaining pages in the background
      void fetchRemainingPagesHelper({
        layerId,
        startPage: 2,
        fetchSize,
        observedServerPageSize: first.observedServerPageSize,
        totalExpected: first.totalExpected,
        usedPath: first.usedPath,
        sampleItemKeys: first.sampleItemKeys,
        layerLabel,
        aggregated: [...this.data],
        token: this.fetchToken,
      }, {
        isCancelled: (t) => t !== this.fetchToken,
        onBatch: ({ aggregated: ag, totalExpected: te, usedPath: up, sampleItemKeys: sk }) => {
          runInAction(() => {
            this.data = [...ag];
            const lid = this.selectedLayer ?? layerId;
            this.layerDataCache.set(lid, [...ag]);
            this.layerTotalCache.set(lid, te);
            this.lastCount = ag.length;
            this.totalCount = te !== null ? Math.max(te, ag.length) : null;
            this.listKeyPath = up;
            this.sampleItemKeys = sk;
            this.debugStatus = ag.length ? 'ok' : 'empty';
          });
        },
        onFinish: ({ aggregated: ag, totalExpected: te, usedPath: up, sampleItemKeys: sk }) => {
          runInAction(() => {
            this.data = [...ag];
            const lid = this.selectedLayer ?? layerId;
            this.layerDataCache.set(lid, [...ag]);
            this.layerTotalCache.set(lid, te);
            this.lastCount = ag.length;
            this.totalCount = te !== null ? Math.max(te, ag.length) : null;
            this.listKeyPath = up;
            this.sampleItemKeys = sk;
            this.debugStatus = ag.length ? 'ok' : 'empty';
            this.backgroundLoading = false;
          });
        },
        onError: () => {
          runInAction(() => { this.backgroundLoading = false; });
        },
      });
    } catch (err: unknown) {
      // Narrow potential axios error shape without importing axios types here
  const maybeResp = (err as { response?: { status?: number; headers?: Record<string, string> } }).response;
      const status = maybeResp?.status;
      // Decide whether to show error (disconnected) or treat as no data (reachable but HTTP error)
      const hasResponse = !!maybeResp;
      const maybeMessage = (err as { message?: string }).message;
      runInAction(() => {
        this.error = hasResponse ? null : (maybeMessage ?? 'Failed to reach API');
        // No fallback; clear data
        this.data = [];
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
      });
    } finally {
      runInAction(() => { this.loading = false; this.backgroundLoading = false; });
    }
  }

  // Background fetch moved to helper
}

export const logStore = new LogStore();
