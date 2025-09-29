import { makeAutoObservable, runInAction } from 'mobx';
import { devApi } from '../components/endpoints/Interceptor';
import { parseMaybeJson, tryKeys, preferredPaths, deepFindArray, mapToLogRecord } from './logUtils';
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
  // Per-layer per-page cache: Map<layerId, Map<page, LogRecord[]>>
  layerPageCache = new Map<number, Map<number, LogRecord[]>>();
  layerTotalCache = new Map<number, number | null>();
  // Tracks pages currently being fetched to avoid duplicate requests
  private loadingPages = new Set<string>();
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
          // Init page cache for page 1
          const pageMap = new Map<number, LogRecord[]>();
          pageMap.set(1, [...aggregated.slice(0, this.apiFetchPageSize)]);
          this.layerPageCache.set(layerId, pageMap);
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
        concurrency: 3,
        batchSize: this.commitBatchSize,
        token: this.fetchToken,
      }, {
        isCancelled: (t) => t !== this.fetchToken,
        onBatch: ({ aggregated: ag, totalExpected: te, usedPath: up, sampleItemKeys: sk }) => {
          runInAction(() => {
            this.data = [...ag];
            const lid = this.selectedLayer ?? layerId;
            this.layerDataCache.set(lid, [...ag]);
            // Update per-page cache heuristically: rebuild pages from aggregated snapshot
            const pageMap = this.layerPageCache.get(lid) ?? new Map<number, LogRecord[]>();
            for (let i = 0; i < ag.length; i += this.apiFetchPageSize) {
              const p = Math.floor(i / this.apiFetchPageSize) + 1;
              pageMap.set(p, ag.slice(i, i + this.apiFetchPageSize));
            }
            this.layerPageCache.set(lid, pageMap);
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
            // Finalize per-page cache
            const pageMap = this.layerPageCache.get(lid) ?? new Map<number, LogRecord[]>();
            for (let i = 0; i < ag.length; i += this.apiFetchPageSize) {
              const p = Math.floor(i / this.apiFetchPageSize) + 1;
              pageMap.set(p, ag.slice(i, i + this.apiFetchPageSize));
            }
            this.layerPageCache.set(lid, pageMap);
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

  // Fetch a single page (1-based). Uses per-page cache when available. Prefetches adjacent pages.
  async fetchPage(page: number): Promise<void> {
    const layerId = this.selectedLayer ?? 1;
    const pageMap = this.layerPageCache.get(layerId) ?? new Map<number, LogRecord[]>();
    if (pageMap.has(page)) {
      runInAction(() => {
        this.data = (pageMap.get(page) ?? []).slice();
        this.lastCount = this.data.length;
        this.totalCount = this.layerTotalCache.get(layerId) ?? this.totalCount;
        this.debugStatus = this.data.length ? 'ok' : 'empty';
      });
      // Prefetch neighbors
      void this.prefetchPages(page);
      return;
    }

    // Not in cache: fetch from API page-sized
    const pageKey = `${layerId}:${page}`;
    if (this.loadingPages.has(pageKey)) return; // already fetching
    this.loadingPages.add(pageKey);
    runInAction(() => { this.loading = true; this.error = null; });
    try {
      const resp = await devApi.get('admin/logtrails/get', {
        params: { LayerID: layerId, PageIndex: page, PageSize: this.apiFetchPageSize },
        headers: { Accept: 'text/plain' },
      });

      const parsed = parseMaybeJson(resp.data as unknown);
      let list: unknown[] = [];
      let usedPath: string | null = null;
      if (Array.isArray(parsed)) {
        list = parsed as unknown[];
        usedPath = '(rootArray)';
      } else if (parsed && typeof parsed === 'object') {
        const r = tryKeys(parsed as Record<string, unknown>, preferredPaths);
        list = r.list;
        usedPath = r.path;
        if ((!Array.isArray(list) || list.length === 0)) {
          const d = deepFindArray(parsed as Record<string, unknown>, 4, []);
          if (Array.isArray(d.list)) { list = d.list; usedPath = d.path; }
        }
      }

      const layerLabel = this.layerOptions.find(o => o.value === layerId)?.label ?? 'LAYER';
      const chunkSize = 200; // small chunk for responsive parsing
      const mapped: LogRecord[] = [];
      for (let i = 0; i < list.length; i += chunkSize) {
        const slice = list.slice(i, i + chunkSize) as Record<string, unknown>[];
        const part = slice.map((it, idx) => mapToLogRecord(it, ((page - 1) * this.apiFetchPageSize) + i + idx, layerLabel));
        mapped.push(...part);
        // commit incremental results so the UI sees rows as they are parsed
        runInAction(() => {
          const pm = pageMap;
          pm.set(page, mapped.slice());
          this.layerPageCache.set(layerId, pm);
          this.data = mapped.slice();
          this.lastCount = mapped.length;
          this.listKeyPath = this.listKeyPath ?? usedPath;
          this.debugStatus = mapped.length ? 'ok' : 'empty';
        });
        // yield to event loop to remain responsive
  await Promise.resolve();
      }

      // final commit (ensure full page stored)
      runInAction(() => {
        const pm = pageMap;
        pm.set(page, mapped.slice());
        this.layerPageCache.set(layerId, pm);
        this.data = mapped.slice();
        this.lastCount = mapped.length;
        this.debugStatus = mapped.length ? 'ok' : 'empty';
      });
      void this.prefetchPages(page);
    } catch (err) {
      runInAction(() => { this.error = (err as Error).message; this.debugStatus = 'disconnected'; });
    } finally {
      this.loadingPages.delete(pageKey);
      runInAction(() => { this.loading = false; });
    }
  }

  // Prefetch adjacent pages (page-1, page+1)
  private async prefetchPages(page: number): Promise<void> {
    const layerId = this.selectedLayer ?? 1;
    const pageMap = this.layerPageCache.get(layerId) ?? new Map<number, LogRecord[]>();
    const toPrefetch = [page - 1, page + 1].filter(p => p >= 1 && !pageMap.has(p));
    for (const p of toPrefetch) {
      // fire-and-forget
      void this.fetchPage(p);
    }
  }

  // Background fetch moved to helper
}

export const logStore = new LogStore();
