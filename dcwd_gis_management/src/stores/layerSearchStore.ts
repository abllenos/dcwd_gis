import { makeAutoObservable, runInAction } from 'mobx';
import { devApi } from '../components/endpoints/Interceptor';
import type { LogRecord } from './logTypes';
import { parseMaybeJson, tryKeys, preferredPaths, deepFindArray, mapToLogRecord } from './logUtils';

// Lightweight, no-caching search across all pages of a layer.
// Scans pages in controlled parallel, filters matches, and yields results incrementally.
class LayerSearchStore {
  active = false;
  layerId: number | null = null;
  query = '';
  results: LogRecord[] = [];
  loading = false;      // true while fetching a batch
  scanning = false;     // true if more pages are being scanned
  nextPage = 1;         // next PageIndex to scan (1-based)
  scannedPages = 0;     // pages scanned so far
  totalExpected: number | null = null;
  lastError: string | null = null;
  private token = 0;    // cancellation token
  private typingTimer: number | null = null;
  readonly autoStartDelay = 600; // ms debounce before auto-start

  // Tunables
  readonly concurrency = 3;
  readonly pagesPerBatch = 40; // scan this many pages per "Load more" batch
  readonly mapChunkSize = 200; // incremental mapping chunk to keep UI responsive

  constructor() {
    makeAutoObservable(this, {
      concurrency: false,
      pagesPerBatch: false,
      mapChunkSize: false,
    });
  }

  start(query: string, layerId: number, fetchSize: number) {
    this.token++;
    const t = this.token;
    runInAction(() => {
      this.active = true;
      this.layerId = layerId;
      this.query = query.trim();
      this.results = [];
      this.loading = false;
      this.scanning = true;
      this.nextPage = 1;
      this.scannedPages = 0;
      this.totalExpected = null;
      this.lastError = null;
    });
    // Auto-scan all pages in batches until the server returns no data or the search is cancelled.
    void (async () => {
      let hasMore = await this.scanMore(fetchSize, t);
      while (hasMore && t === this.token) {
        hasMore = await this.scanMore(fetchSize, t);
      }
    })();
  }

  /** Schedule an auto-start with debounce; cancels any pending timer. */
  scheduleAutoStart(query: string, layerId: number, fetchSize: number) {
    // clear any existing timer
    if (this.typingTimer !== null) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
    const q = query.trim();
    if (!q) {
      // empty query -> clear results immediately
      this.clear();
      return;
    }
    this.typingTimer = window.setTimeout(() => {
      // ensure not cancelled in the meantime
      this.start(q, layerId, fetchSize);
      this.typingTimer = null;
    }, this.autoStartDelay);
  }

  /** Clear any pending timers and results, returning UI to paginated view. */
  clear() {
    if (this.typingTimer !== null) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
    this.token++; // cancel current scanning
    runInAction(() => {
      this.active = false;
      this.loading = false;
      this.scanning = false;
      this.results = [];
      this.nextPage = 1;
      this.scannedPages = 0;
      this.totalExpected = null;
      this.lastError = null;
    });
  }

  cancel() {
    this.token++;
    runInAction(() => {
      this.active = false;
      this.loading = false;
      this.scanning = false;
    });
  }

  async loadMore(fetchSize: number) {
    if (!this.active || this.loading) return;
    const t = this.token;
    await this.scanMore(fetchSize, t);
  }

  private async scanMore(fetchSize: number, t: number): Promise<boolean> {
    const layerId = this.layerId ?? 1;
    runInAction(() => { this.loading = true; this.lastError = null; });
    try {
      const start = this.nextPage;
      const end = start + this.pagesPerBatch - 1;
      let schedule = start;
      const matches: LogRecord[] = [];
      let reachedEnd = false;
      let hadError = false;

      const workers: Promise<void>[] = [];
      for (let w = 0; w < this.concurrency; w++) {
        const worker = (async () => {
          while (schedule <= end) {
            if (t !== this.token) return; // cancelled
            const page = schedule++;
            // Safety max pages; if server doesn’t expose total, rely on empty-page to stop
            if (page > 40000) return;
            const outcome = await this.fetchAndFilterPage({ layerId, page, fetchSize, token: t, matches });
            if (outcome === 'end') { reachedEnd = true; break; }
            if (outcome === 'error') { hadError = true; break; }
          }
        })();
        workers.push(worker);
      }
  await Promise.all(workers);

  if (t !== this.token) return false;
      runInAction(() => {
        // Append new matches in a single commit
        if (matches.length) this.results = [...this.results, ...matches];
        this.scannedPages += Math.max(0, Math.min(end, schedule - 1) - start + 1);
        this.nextPage = Math.max(this.nextPage, schedule);
        this.loading = false;
        // Continue scanning only if no end-of-data and no error occurred
        this.scanning = !reachedEnd && !hadError;
      });
      return !reachedEnd && !hadError;
    } catch (err) {
      if (t !== this.token) return false;
      runInAction(() => {
        this.lastError = (err as Error).message || 'Search failed';
        this.loading = false;
        this.scanning = false;
      });
      return false;
    }
  }

  private async fetchAndFilterPage(args: { layerId: number; page: number; fetchSize: number; token: number; matches: LogRecord[]; }): Promise<'ok' | 'end' | 'error'> {
    const { layerId, page, fetchSize, token, matches } = args;
    if (token !== this.token) return 'error';
    try {
      const resp = await devApi.get('admin/logtrails/get', {
        params: { LayerID: layerId, PageIndex: page, PageSize: fetchSize },
        headers: { Accept: 'text/plain' },
      });
      const parsed = parseMaybeJson(resp.data as unknown);
      let list: unknown[] = [];
      if (Array.isArray(parsed)) {
        list = parsed as unknown[];
      } else if (parsed && typeof parsed === 'object') {
        // Prefer new envelope: payload.data.data (array), and totals from data.count/totalCount
        const outer = parsed as Record<string, unknown>;
        const dataNode = outer.data as Record<string, unknown> | undefined;
        const nested = dataNode?.data as unknown;
        if (Array.isArray(nested)) {
          list = nested as unknown[];
          const c1 = Number((dataNode as { count?: unknown } | undefined)?.count);
          const c2 = Number((dataNode as { totalCount?: unknown } | undefined)?.totalCount);
          const cand = !Number.isNaN(c1) && c1 > 0 ? c1 : (!Number.isNaN(c2) && c2 > 0 ? c2 : null);
          if (cand && (this.totalExpected === null || cand > this.totalExpected)) {
            runInAction(() => { this.totalExpected = cand; });
          }
        }
        // Fallbacks for legacy shapes
        if (!Array.isArray(list) || list.length === 0) {
          const r = tryKeys(outer, preferredPaths);
          list = r.list;
          if ((!Array.isArray(list) || list.length === 0)) {
            const d = deepFindArray(outer, 4, []);
            if (Array.isArray(d.list)) list = d.list;
          }
          // Also try totals from outer if present
          const outerTotal = Number((outer as { totalCount?: unknown }).totalCount);
          if (!Number.isNaN(outerTotal) && outerTotal > 0 && (this.totalExpected === null || outerTotal > this.totalExpected)) {
            runInAction(() => { this.totalExpected = outerTotal; });
          }
        }
      }

      if (!Array.isArray(list) || list.length === 0) return 'end'; // end of list

      const layerLabel = String(this.layerId ?? 'LAYER');
      const q = this.query.toLowerCase();
      // map in chunks and push only matches
      for (let i = 0; i < list.length; i += this.mapChunkSize) {
        if (token !== this.token) return 'error';
        const slice = list.slice(i, i + this.mapChunkSize) as Record<string, unknown>[];
        const mapped = slice.map((it, idx) => mapToLogRecord(it, ((page - 1) * fetchSize) + i + idx, layerLabel));
        for (const r of mapped) {
          if (this.matches(r, q)) matches.push(r);
        }
        // yield to keep main thread responsive
        await Promise.resolve();
      }
      return 'ok';
    } catch {
      return 'error';
    }
  }

  private matches(r: LogRecord, q: string): boolean {
    if (!q) return false;
    return (
      String(r.id).includes(q) ||
      r.layerId.toLowerCase().includes(q) ||
      r.assetId.toLowerCase().includes(q) ||
      r.modifiedBy.toLowerCase().includes(q) ||
      r.accessFlag.toLowerCase().includes(q) ||
      r.dateTime.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }
}

export const layerSearchStore = new LayerSearchStore();
