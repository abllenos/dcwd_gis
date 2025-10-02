/**
 * WKB (Well-Known Binary) Parser for PostGIS POINT geometries
 * Handles little-endian byte order from PostGIS
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Parse WKB hex string from PostGIS to extract latitude and longitude
 * Format: PostGIS returns POINT geometry as hex-encoded WKB with SRID
 * Example: 0101000020E6100000... (little-endian POINT with SRID 4326)
 */
export function parseWKB(wkbHex: string | undefined): Coordinates | null {
  if (!wkbHex || typeof wkbHex !== 'string') {
    return null;
  }

  try {
    // Remove any whitespace
    const hex = wkbHex.trim();
    
    // Minimum length check (byte order + type + SRID + 2 doubles = 42 hex chars)
    if (hex.length < 42) {
      console.warn('WKB hex string too short:', hex.length);
      return null;
    }

    // Parse byte order (1 byte = 2 hex chars)
    const byteOrder = hex.substring(0, 2);
    const isLittleEndian = byteOrder === '01';
    
    if (!isLittleEndian) {
      console.warn('Big-endian WKB not supported');
      return null;
    }

    // Parse geometry type (4 bytes = 8 hex chars) with byte reversal for little-endian
    const geomTypeHex = hex.substring(2, 10);
    // Reverse byte order for little-endian reading
    const geomTypeReversed = geomTypeHex.match(/../g)?.reverse().join('') || '';
    const geomType = parseInt(geomTypeReversed, 16);
    
    // SRID flag is 0x20000000 (536870912), POINT is 1
    // So POINT with SRID = 0x20000001 (536870913)
    const hasSRID = (geomType & 0x20000000) !== 0;
    const baseType = geomType & 0x1FFFFFFF;
    
    if (baseType !== 1) {
      console.warn('Not a POINT geometry:', baseType);
      return null;
    }

    let offset = 10; // Current position after geometry type
    
    // Skip SRID if present (4 bytes = 8 hex chars)
    if (hasSRID) {
      offset += 8;
    }

    // Read X coordinate (longitude) - 8 bytes = 16 hex chars
    const xHex = hex.substring(offset, offset + 16);
    offset += 16;
    
    // Read Y coordinate (latitude) - 8 bytes = 16 hex chars
    const yHex = hex.substring(offset, offset + 16);
    
    // Convert little-endian hex to double
    const longitude = hexToDouble(xHex, true);
    const latitude = hexToDouble(yHex, true);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn('Invalid coordinates parsed');
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    console.error('Error parsing WKB:', error);
    return null;
  }
}

/**
 * Convert hex string to IEEE 754 double precision float
 */
function hexToDouble(hex: string, littleEndian: boolean): number {
  // Convert hex pairs to bytes
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  
  // Create DataView to handle byte order
  const buffer = new Uint8Array(bytes).buffer;
  const view = new DataView(buffer);
  
  // Read as double with specified byte order
  return view.getFloat64(0, littleEndian);
}

/**
 * Convert latitude and longitude to WKB hex string
 * Creates a POINT geometry with SRID 4326 (WGS84)
 */
export function coordinatesToWKB(longitude: number, latitude: number): string {
  // Create binary buffer
  const buffer = new ArrayBuffer(21); // 1 + 4 + 4 + 8 + 8 bytes
  const view = new DataView(buffer);
  
  let offset = 0;
  
  // Byte order (little-endian)
  view.setUint8(offset, 0x01);
  offset += 1;
  
  // Geometry type: POINT with SRID (0x20000001)
  view.setUint32(offset, 0x20000001, true);
  offset += 4;
  
  // SRID: 4326 (WGS84)
  view.setUint32(offset, 4326, true);
  offset += 4;
  
  // X coordinate (longitude)
  view.setFloat64(offset, longitude, true);
  offset += 8;
  
  // Y coordinate (latitude)
  view.setFloat64(offset, latitude, true);
  
  // Convert buffer to hex string
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}
