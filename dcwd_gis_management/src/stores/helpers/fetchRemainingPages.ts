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
}

export interface BackgroundFetchCallbacks {
  isCancelled: (token: number) => boolean;
  onBatch: (args: { aggregated: LogRecord[]; totalExpected: number | null; usedPath: string | null; sampleItemKeys: string[] | null; }) => void;
  onFinish: (args: { aggregated: LogRecord[]; totalExpected: number | null; usedPath: string | null; sampleItemKeys: string[] | null; }) => void;
  onError: () => void;
}

// Runs the background paging loop and surfaces results via callbacks.
export async function fetchRemainingPages(opts: BackgroundFetchOpts, cb: BackgroundFetchCallbacks): Promise<void> {
  const { layerId, startPage, fetchSize, layerLabel, aggregated, token } = opts;
  let { observedServerPageSize, totalExpected, usedPath, sampleItemKeys } = opts;
  let pageIndex = startPage;
  const bgPath = 'admin/logtrails/get';
  let committed = aggregated.length;

  while (true) {
    if (cb.isCancelled(token)) return;
    let payload: unknown;
    try {
      const resp = await devApi.get(bgPath, {
        params: { LayerID: layerId, PageIndex: pageIndex, PageSize: fetchSize },
        headers: { Accept: 'text/plain' },
      });
      payload = parseMaybeJson(resp.data as unknown);
    } catch {
      cb.onError();
      return;
    }

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
      // Update credible total if larger
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

    if (!Array.isArray(list) || list.length === 0) break;
    if (pageIndex === 2 && observedServerPageSize === null) { observedServerPageSize = list.length; }
    if (!usedPath) usedPath = pagePath;
    if (!sampleItemKeys) {
      try {
        const first = list[0];
        sampleItemKeys = first && typeof first === 'object' ? Object.keys(first as object) : null;
      } catch { sampleItemKeys = null; }
    }

    const mapped = (list as unknown[]).map((it, idx) => (
      mapToLogRecord(it as Record<string, unknown>, aggregated.length + idx, layerLabel)
    ));
    aggregated.push(...mapped);

    if (cb.isCancelled(token)) return;
    const readyToCommit = (aggregated.length - committed) >= 5000; // batch size mirrored
    if (readyToCommit) {
      cb.onBatch({ aggregated, totalExpected, usedPath, sampleItemKeys });
      committed = aggregated.length;
    }

    const endByTotal = totalExpected !== null && aggregated.length >= totalExpected;
    const endByShortPage = observedServerPageSize !== null && mapped.length < observedServerPageSize;
    const endByLimit = pageIndex >= 40000;
    if (endByTotal || endByShortPage || endByLimit) break;
    pageIndex += 1;
  }

  if (cb.isCancelled(token)) return;
  cb.onFinish({ aggregated: opts.aggregated, totalExpected, usedPath, sampleItemKeys });
}
