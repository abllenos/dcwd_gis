// Shared mapping function for license and map info users
// For array-based user: [id, licenseType, department, computerName]
export function mapApiUserToTableRow(u: any, idx: number) {
  if (Array.isArray(u)) {
    return {
      id: u[0] ?? idx + 1,
      software: u[1] ?? 'N/A',
      department: u[2] ?? 'N/A',
      deviceName: u[3] ?? 'N/A',
      key: u[0] ?? idx,
    };
  }
  // fallback for object-based user
  return {
    id: u.id ?? u.userId ?? u.user_id ?? idx + 1,
    software: u.software ?? u.license_type ?? u.licenseType ?? 'N/A',
    department: u.department ?? 'N/A',
    deviceName: u.deviceName ?? u.device_name ?? u.computerName ?? u.pc_name ?? 'N/A',
    key: u.id ?? u.userId ?? u.user_id ?? u.deviceName ?? u.device_name ?? idx,
  };
}
