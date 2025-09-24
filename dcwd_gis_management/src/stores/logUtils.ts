import type { LayerOption, LogRecord } from './logTypes';

// -----------------------------
// Layer options
// -----------------------------
/** Canonical list of selectable GIS layers (1–30). */
export const defaultLayerOptions: LayerOption[] = [
  { value: 1, label: 'PMS' },
  { value: 2, label: 'UNIVERSAL' },
  { value: 3, label: 'AIR RELEASE VALVE' },
  { value: 4, label: 'FIRE HYDRANT' },
  { value: 5, label: 'ISOLATION VALVE' },
  { value: 6, label: 'BLOW-OFF VALVE' },
  { value: 7, label: 'PRESSURE RELEASE VALVE' },
  { value: 8, label: 'PRESSURE SETTING VALVE' },
  { value: 9, label: 'REDUCER' },
  { value: 10, label: 'CUSTOMER' },
  { value: 11, label: 'BRGY BOUNDARY' },
  { value: 12, label: 'PARCEL' },
  { value: 13, label: 'ROAD' },
  { value: 14, label: 'STREET' },
  { value: 15, label: 'SUBDIVISION' },
  { value: 16, label: 'SUBDIVISION BLOCK' },
  { value: 17, label: 'SUBDIVISION BOUNDARY' },
  { value: 18, label: 'BUILDING FOOTPRINT' },
  { value: 19, label: 'CARETAKER BOUNDARY' },
  { value: 20, label: 'PIPE SYSTEM' },
  { value: 21, label: 'LOGGER NOISE' },
  { value: 22, label: 'DMA BOUNDARY' },
  { value: 23, label: 'CSR PROJECT' },
  { value: 24, label: 'CSR SCHOOL' },
  { value: 25, label: 'DATA PMS MAINTENANCE' },
  { value: 26, label: 'WSS BOUNDARY' },
  { value: 27, label: 'PRODUCTION WELLS' },
  { value: 28, label: 'PIPE BRIDGE CROSSING' },
  { value: 29, label: 'MOD ZONING' },
  { value: 30, label: 'SERVICE LINE' },
];

// -----------------------------
// Normalizers & parsers
// -----------------------------
/** Synonym map for action flags (case-insensitive lookup). */
const FLAG_MAP: Record<string, LogRecord['accessFlag']> = {
  CREATE: 'CREATE', ADD: 'CREATE', INSERT: 'CREATE', NEW: 'CREATE',
  UPDATE: 'UPDATE', EDIT: 'UPDATE', MODIFY: 'UPDATE', PATCH: 'UPDATE',
  DELETE: 'DELETE', REMOVE: 'DELETE', DEL: 'DELETE',
};

/** Normalize action/flag values to a canonical variant. */
export const normalizeFlag = (v: unknown): LogRecord['accessFlag'] => {
  // Map common numeric codes if the API sends numbers (e.g., 1=view)
  if (typeof v === 'number') {
    switch (v) {
      case 1: return 'VIEW';
      case 2: return 'CREATE';
      case 3: return 'UPDATE';
      case 4: return 'DELETE';
      default: break;
    }
  }
  const s = String(v ?? '').trim().toUpperCase();
  return FLAG_MAP[s] ?? 'VIEW';
};

/**
 * If a string looks like JSON (object/array), parse it; otherwise return input.
 */
export const parseMaybeJson = (payload: unknown): unknown => {
  if (typeof payload !== 'string') return payload;
  const trimmed = payload.trim();
  const looksJson = (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                    (trimmed.startsWith('[') && trimmed.endsWith(']'));
  if (!looksJson) return payload;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return payload; // swallow JSON parse errors
  }
};

// -----------------------------
// Preferred extraction paths
// -----------------------------
/** Common places where a "list" of items may live in an API response. */
export const preferredPaths: string[][] = [
  ['data'], ['data', 'data'], ['data', 'items'], ['data', 'result'], ['data', 'records'],
  ['data', 'rows'], ['data', 'list'], ['data', 'logs'], ['data', 'logtrails'], ['data', 'logTrails'],
  ['result'], ['records'], ['rows'], ['items'], ['list'], ['logs'], ['logtrails'], ['logTrails'],
];

/** Try to follow the first path that yields an array. */
export const tryKeys = (
  obj: Record<string, unknown>,
  keys: string[][],
): { list: unknown[]; path: string | null } => {
  for (const path of keys) {
    let cur: unknown = obj;
    let ok = true;
    for (const k of path) {
      if (cur && typeof cur === 'object' && k in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[k];
      } else {
        ok = false; break;
      }
    }
    if (ok && Array.isArray(cur)) return { list: cur, path: path.join('.') };
  }
  return { list: [], path: null };
};

/** Deeply scan an object to find the first array (prefer non-empty), up to a max depth. */
export const deepFindArray = (
  obj: Record<string, unknown> | unknown[],
  maxDepth = 4,
  path: string[] = [],
): { list: unknown[]; path: string | null } => {
  if (!obj || typeof obj !== 'object' || maxDepth < 0) return { list: [], path: null };
  if (Array.isArray(obj)) return { list: obj, path: path.join('.') || '(rootArray)' };

  let bestEmpty: { list: unknown[]; path: string | null } | null = null;
  const rec = obj as Record<string, unknown>;
  for (const k of Object.keys(rec)) {
    const v = rec[k];
    if (Array.isArray(v)) {
      if (v.length > 0) return { list: v, path: [...path, k].join('.') };
      if (!bestEmpty) bestEmpty = { list: v, path: [...path, k].join('.') };
    } else if (v && typeof v === 'object') {
      const r = deepFindArray(v as Record<string, unknown>, maxDepth - 1, [...path, k]);
      if (Array.isArray(r.list) && r.list.length > 0) return r;
      if (!bestEmpty && Array.isArray(r.list)) bestEmpty = r;
    }
  }
  return bestEmpty ?? { list: [], path: null };
};

// -----------------------------
// Mapping helpers
// -----------------------------
/** Safely get the first defined, non-null value from an object by candidate keys. */
const firstDefined = (obj: Record<string, unknown>, keys: readonly string[]): unknown => {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v !== undefined && v !== null) return v;
    }
  }
  return undefined;
};

const KEY_CANDIDATES = {
  id: ['id', 'logId', 'LogId', 'LogID', 'ID'] as const,
  layerId: ['layerId', 'layer_id', 'LayerID', 'LayerId', 'layer', 'layerid'] as const,
  assetId: ['assetId', 'asset_id', 'AssetID', 'AssetId', 'asset', 'assetid'] as const,
  modifiedBy: ['modifiedBy', 'modified_by', 'ModifiedBy', 'user', 'User', 'username', 'UserName', 'Username'] as const,
  accessFlag: ['accessFlag', 'AccessFlag', 'action', 'Action', 'operation', 'Operation', 'type', 'Type', 'access_flg'] as const,
  dateTime: ['dateTime', 'DateTime', 'datetime', 'timestamp', 'Timestamp', 'date', 'Date', 'createdAt', 'CreatedAt', 'updatedAt', 'UpdatedAt', 'transaction_datetime'] as const,
  description: ['description', 'Description', 'message', 'Message', 'remarks', 'Remarks', 'note', 'Note', 'details', 'Details'] as const,
} as const;

/** Convert a loose API item into our strict LogRecord shape. */
export const mapToLogRecord = (it: Record<string, unknown>, idx: number, layerLabel: string): LogRecord => {
  const idRaw = firstDefined(it, KEY_CANDIDATES.id);
  const layerIdRaw = firstDefined(it, KEY_CANDIDATES.layerId);
  const assetIdRaw = firstDefined(it, KEY_CANDIDATES.assetId);
  const modifiedByRaw = firstDefined(it, KEY_CANDIDATES.modifiedBy);
  const accessFlagRaw = firstDefined(it, KEY_CANDIDATES.accessFlag);
  const dateTimeRaw = firstDefined(it, KEY_CANDIDATES.dateTime);
  const descriptionRaw = firstDefined(it, KEY_CANDIDATES.description);

  const idNum = typeof idRaw === 'number' ? idRaw : Number(String(idRaw ?? idx + 1));
  // Clean up layer string: trim spaces but preserve prefixes like "DCWD_"
  const rawLayerStr = String(layerIdRaw ?? layerLabel);
  const layerId = rawLayerStr.trim();
  const assetId = String(assetIdRaw ?? `${layerLabel}-${1000 + idx}`);
  const modifiedBy = String(modifiedByRaw ?? '-');
  const accessFlag = normalizeFlag(accessFlagRaw);
  const dateTime = String(dateTimeRaw ?? new Date().toISOString());
  const description = String(descriptionRaw ?? '');

  return {
    id: Number.isNaN(idNum) ? idx + 1 : idNum,
    layerId,
    assetId,
    modifiedBy,
    accessFlag,
    dateTime,
    description,
  };
};
