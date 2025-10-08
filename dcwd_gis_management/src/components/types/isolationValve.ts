// IsolationValve type moved here for shared use
export interface IsolationValve {
    id?: number;
    gvnumber: string;
    wonumber: string;
    location: string;
    size: number;
    noofturns: number;
    depth: number;
    brand: string;
    valve: string;
    project_title: string;
    barangay: string;
    geom?: string;  // WKB hex string from PostGIS for map location
    elevation?: number;
    water_source?: string;
    date_installed?: string;
    status?: string;
    valve_status?: string;
    purpose?: string;
    remarks?: string;
}