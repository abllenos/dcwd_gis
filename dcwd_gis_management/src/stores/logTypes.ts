export interface LogRecord {
  id: number;
  layerId: string;
  assetId: string;
  modifiedBy: string;
  accessFlag: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';
  dateTime: string; // ISO string
  description: string;
}

export interface LayerOption {
  value: number;
  label: string;
}

export type DebugStatus = 'ok' | 'empty' | 'disconnected' | 'http-error' | 'loading' | null;
