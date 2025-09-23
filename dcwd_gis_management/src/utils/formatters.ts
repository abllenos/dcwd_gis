// Shared formatting helpers used across the app UI.
export const safeString = (v?: string) => (v ?? '').toString();

/**
 * Format asset IDs like "CUSTOMER-1000" to just "1000" when possible.
 * Falls back to last hyphen-separated segment if no trailing digits.
 */
export const formatAssetId = (v?: string) => {
  const s = safeString(v).trim();
  if (!s) return '';
  const m = s.match(/(\d+)$/);
  if (m) return m[1];
  const parts = s.split('-');
  return parts.length > 1 ? parts[parts.length - 1] : s;
};

export default {
  safeString,
  formatAssetId,
};
