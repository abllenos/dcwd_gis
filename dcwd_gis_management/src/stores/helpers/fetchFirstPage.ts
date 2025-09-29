import { devApi } from '../../components/endpoints/Interceptor';
import { parseMaybeJson, preferredPaths, tryKeys, deepFindArray, mapToLogRecord } from '../logUtils';
import type { LogRecord } from '../logTypes';

export interface FirstPageResult {
  aggregated: LogRecord[];
  totalExpected: number | null;
  observedServerPageSize: number | null;
  usedPath: string | null;
  sampleItemKeys: string[] | null;
  diagnostics: {
    lastStatus: number | null;
    lastContentType: string | null;
    lastCurl: string | null;
    lastEffectiveUrl: string | null;
    lastRequestParams: Record<string, unknown> | null;
    rawPayloadType: string | null;
    rawPayloadLength: number | null;
    payloadKeys: string[] | null;
    lastUrl: string | null;
  };
  appEmpty: boolean;
  listEmpty: boolean;
}

export async function fetchFirstPage(opts: { layerId: number; fetchSize: number; layerLabel: string; }): Promise<FirstPageResult> {
  const { layerId, fetchSize, layerLabel } = opts;
  const path = 'admin/logtrails/get';
  const base = (devApi.defaults.baseURL ?? '').replace(/\/$/, '');
  const pageIndex = 1;
  const fullUrl = `${base}/${path}?LayerID=${layerId}&PageIndex=${pageIndex}&PageSize=${fetchSize}`;
  const resp = await devApi.get(path, {
    params: { LayerID: layerId, PageIndex: pageIndex, PageSize: fetchSize },
    headers: { Accept: 'text/plain' },
  });

  const { status, headers } = resp;
  const reqObj = (resp as unknown as { request?: { responseURL?: string } }).request;
  const lastEffectiveUrl = reqObj?.responseURL || resp.config?.url || fullUrl;
  const lastRequestParams = { LayerID: layerId, PageIndex: pageIndex, PageSize: fetchSize } as Record<string, unknown>;

  const payload: unknown = parseMaybeJson(resp.data as unknown);
  const rawPayloadType = Array.isArray(payload) ? 'array' : typeof payload;
  const rawPayloadLength = typeof payload === 'string' ? payload.length : (Array.isArray(payload) ? payload.length : null);
  const payloadKeys = payload && typeof payload === 'object' && !Array.isArray(payload) ? Object.keys(payload) : null;

  const appStatus = Number((payload && typeof payload === 'object' ? (payload as { statusCode?: number | string }).statusCode : undefined));
  const appEmpty = !Number.isNaN(appStatus) && appStatus >= 400;

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
  }
  const listEmpty = !Array.isArray(list) || list.length === 0;

  // Total detection (credible only)
  let totalExpected: number | null = null;
  if (payload && typeof payload === 'object') {
    const outer = payload as Record<string, unknown>;
    const inner = outer.data as Record<string, unknown> | undefined;
    const maybeTotals: number[] = [];
    const innerTotal = Number(inner && (inner as { totalCount?: unknown }).totalCount);
    const outerTotal = Number(outer && (outer as { totalCount?: unknown }).totalCount);
    if (!Number.isNaN(innerTotal) && innerTotal > 0) maybeTotals.push(innerTotal);
    if (!Number.isNaN(outerTotal) && outerTotal > 0) maybeTotals.push(outerTotal);
    if (maybeTotals.length) totalExpected = Math.max(...maybeTotals);
  }

  const observedServerPageSize = Array.isArray(list) ? list.length : null;

  const aggregated: LogRecord[] = Array.isArray(list)
    ? (list as unknown[]).map((it, idx) => (
      mapToLogRecord(it as Record<string, unknown>, idx, layerLabel)
    ))
    : [];

  const diagnostics = {
    lastStatus: status ?? null,
    lastContentType: headers?.['content-type'] ?? (headers as Record<string, string> | undefined)?.['Content-Type'] ?? null,
    lastCurl: `curl -X 'GET' '${fullUrl}' -H 'accept: text/plain'`,
    lastEffectiveUrl,
    lastRequestParams,
    rawPayloadType,
    rawPayloadLength,
    payloadKeys,
    lastUrl: `${base}/${path}`,
  } as const;

  return {
    aggregated,
    totalExpected,
    observedServerPageSize,
    usedPath: pagePath,
    sampleItemKeys: Array.isArray(list) && list[0] && typeof list[0] === 'object' ? Object.keys(list[0] as object) : null,
    diagnostics,
    appEmpty,
    listEmpty,
  };
}
