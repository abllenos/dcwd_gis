import { devApi } from '../../components/endpoints/Interceptor';
import { parseMaybeJson, preferredPaths, tryKeys, deepFindArray, mapToLogRecord } from '../logUtils';
import type { LogRecord } from '../logTypes';

export interface BackgroundFetchOpts {
  layerId: number;
  startPage: number;
  fetchSize: number;
  observedServerPageSize: number | null;
  totalExpected: number | null;
  usedPath: string | null;
  sampleItemKeys: string[] | null;
  layerLabel: string;
  aggregated: LogRecord[];
  token: number;
  // Optional performance tuning
  concurrency?: number; // number of parallel workers
  batchSize?: number; // commit batch size (rows)
}

export interface BackgroundFetchCallbacks {
  isCancelled: (token: number) => boolean;
  onBatch: (args: { aggregated: LogRecord[]; totalExpected: number | null; usedPath: string | null; sampleItemKeys: string[] | null; }) => void;
  onFinish: (args: { aggregated: LogRecord[]; totalExpected: number | null; usedPath: string | null; sampleItemKeys: string[] | null; }) => void;
  onError: () => void;
}

// Runs the background paging loop and surfaces results via callbacks.
export async function fetchRemainingPages(opts: BackgroundFetchOpts, cb: BackgroundFetchCallbacks): Promise<void> {
  const { layerId, startPage, fetchSize, layerLabel, aggregated, token, concurrency = 1, batchSize = 5000 } = opts;
  let { observedServerPageSize, totalExpected, usedPath, sampleItemKeys } = opts;
  const bgPath = 'admin/logtrails/get';
  // Controlled-parallel fetch using a small worker pool. We schedule page indices starting at
  // `startPage` and allow up to `concurrency` parallel requests. Results are collected per-page
  // and flushed in order to `aggregated` so callers receive correctly ordered rows.
  let nextToSchedule = startPage;
  let finished = false;
  let committed = aggregated.length;
  const pageResults = new Map<number, LogRecord[]>();
  let nextFlushPage = startPage;

  async function fetchPage(pi: number): Promise<{ listLength: number; pagePath: string | null; sampleKeys: string[] | null; observedSizeDelta?: number } | null> {
    if (cb.isCancelled(token) || finished) return null;
    try {
      const resp = await devApi.get(bgPath, {
        params: { LayerID: layerId, PageIndex: pi, PageSize: fetchSize },
        headers: { Accept: 'text/plain' },
      });
      const payload = parseMaybeJson(resp.data as unknown);

      let list: unknown[] = [];
      let pagePath: string | null = null;
      if (Array.isArray(payload)) { list = payload; pagePath = '(rootArray)'; }
      else if (payload && typeof payload === 'object') {
        const r = tryKeys(payload as Record<string, unknown>, preferredPaths);
        list = r.list; pagePath = r.path;
        if ((!Array.isArray(list) || list.length === 0)) {
          const d = deepFindArray(payload as Record<string, unknown>, 4, []);
          if (Array.isArray(d.list)) { list = d.list; pagePath = d.path; }
        }
        const outer = payload as Record<string, unknown>;
        const inner = outer.data as Record<string, unknown> | undefined;
        const innerTotal = Number(inner && (inner as { totalCount?: unknown }).totalCount);
        const outerTotal = Number(outer && (outer as { totalCount?: unknown }).totalCount);
        const threshold = observedServerPageSize ?? 0;
        const candidates = [innerTotal, outerTotal].filter(t => !Number.isNaN(t) && t > threshold) as number[];
        if (candidates.length) {
          totalExpected = totalExpected === null ? Math.max(...candidates) : Math.max(totalExpected, ...candidates);
        }
      }

      if (!Array.isArray(list) || list.length === 0) {
        return { listLength: 0, pagePath: null, sampleKeys: null };
      }

      if (pi === startPage && observedServerPageSize === null) { observedServerPageSize = list.length; }
      if (!usedPath) usedPath = pagePath;
      if (!sampleItemKeys) {
        try {
          const first = list[0];
          sampleItemKeys = first && typeof first === 'object' ? Object.keys(first as object) : null;
        } catch { sampleItemKeys = null; }
      }

      const mapped = (list as unknown[]).map((it, idx) => (
        mapToLogRecord(it as Record<string, unknown>, (pi - 1) * fetchSize + idx, layerLabel)
      ));
      pageResults.set(pi, mapped);
      return { listLength: mapped.length, pagePath: usedPath, sampleKeys: sampleItemKeys };
    } catch {
      cb.onError();
      finished = true;
      return null;
    }
  }

  // Start worker pool
  const workers: Promise<void>[] = [];
  for (let w = 0; w < Math.max(1, Math.floor(concurrency)); w++) {
    const worker = (async () => {
      while (!finished && !cb.isCancelled(token)) {
        const pi = nextToSchedule++;
        // Safety guard
        if (pi > 40000) { finished = true; break; }
        const res = await fetchPage(pi);
        if (!res) { finished = true; break; }
        if (res.listLength === 0) { finished = true; break; }

        // Attempt to flush any contiguous pages starting from nextFlushPage
        while (pageResults.has(nextFlushPage)) {
          const seg = pageResults.get(nextFlushPage)!;
          aggregated.push(...seg);
          pageResults.delete(nextFlushPage);
          nextFlushPage += 1;

          // Commit in batches
          if ((aggregated.length - committed) >= batchSize) {
            cb.onBatch({ aggregated, totalExpected, usedPath, sampleItemKeys });
            committed = aggregated.length;
          }
        }

        // Termination checks after flush
        if (totalExpected !== null && aggregated.length >= totalExpected) { finished = true; break; }
        if (observedServerPageSize !== null) {
          // If the last fetched page had fewer items than observed server page size, it was the final page
          // We can detect that by checking the last fetched `res.listLength` but here we conservatively
          // check whether next scheduled page had no result yet; loop will detect empty page and finish.
        }
      }
    })();
    workers.push(worker);
  }

  // Wait for workers to finish
  await Promise.all(workers);

  if (cb.isCancelled(token)) return;
  cb.onFinish({ aggregated: opts.aggregated, totalExpected, usedPath, sampleItemKeys });
}
