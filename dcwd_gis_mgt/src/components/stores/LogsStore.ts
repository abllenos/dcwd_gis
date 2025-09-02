import { makeObservable, observable, action, runInAction } from "mobx";
import { fetchLogs, fetchGeometry  } from "../endpoints/Logs";

interface Log {
    ID: string,
    layerid: number,
    assetid: string;
    modified_by: string;
    access_flg: string;
    transaction_datetime: string;
    description: string | null;
}

interface LayerOption {
    value: number;
    label: string;
}

export class LogsStore {
    logs: Log[] = [];
    filteredLogs: Log[] = [];
    loading: boolean = false;
    error: string | null = null;

    selectedLayerID: string | null = null;
    layerOptions: LayerOption[] = [];
    searchField: keyof Log = "ID";
    searchValue: string = "";

    selectedLog: Log | null = null;
    geometry: any = null;
    mapCenter: { lat: number; lng: number } | null = null;
    isModalVisible: boolean = false;
    isLoadingGeometry: boolean = false;

    constructor() {
        makeObservable(this, {
            logs: observable,
            filteredLogs: observable,
            loading: observable,
            error: observable,
            selectedLayerID: observable,
            layerOptions: observable,
            searchField: observable,
            searchValue: observable,
            selectedLog: observable,
            geometry: observable,
            mapCenter: observable,
            isModalVisible: observable,
            isLoadingGeometry: observable,

            initLayerOptions: action,
            fetchLogsData: action,
            filterLogs: action,
            setSearchField: action,
            setSearchValue: action,
            selectLog: action,
            closeModal: action
        });

        this.initLayerOptions();
    }

    initLayerOptions() {
        this.layerOptions = [
            { value: 1, label: "PMS" },
            { value: 2, label: "UNIVERSAL" },
            { value: 3, label: "AIR RELEASE VALVE" },
            { value: 4, label: "FIRE HYDRANT" },
            { value: 5, label: "ISOLATION VALVE" },
            { value: 6, label: "BLOW-OFF VALVE" },
            { value: 7, label: "PRESSURE RELEASE VALVE" },
            { value: 8, label: "PRESSURE SETTING VALVE" },
            { value: 9, label: "REDUCER" },
            { value: 10, label: "CUSTOMER" },
            { value: 11, label: "BRGY BOUNDARY" },
            { value: 12, label: "PARCEL" },
            { value: 13, label: "ROAD" },
            { value: 14, label: "STREET" },
            { value: 15, label: "SUBDIVISION" },
            { value: 16, label: "SUBDIVISION BLOCK" },
            { value: 17, label: "SUBDIVISION BOUNDARY" },
            { value: 18, label: "BUILDING FOOTPRINT" },
            { value: 19, label: "CARETAKER BOUNDARY" },
            { value: 20, label: "PIPE SYSTEM" },
            { value: 21, label: "LOGGER NOISE" },
            { value: 22, label: "DMA BOUNDARY" },
            { value: 23, label: "CSR PROJECT" },
            { value: 24, label: "CSR SCHOOL" },
            { value: 25, label: "DATA PMS MAINTENANCE" },
            { value: 26, label: "WSS BOUNDARY" },
            { value: 27, label: "PRODUCTION WELLS" },
            { value: 28, label: "PIPE BRIDGE CROSSING" },
            { value: 29, label: "MOD ZONING" },
            { value: 30, label: "SERVICE LINE" }
        ];
    }

    async fetchLogsData(layerID: string) {
        this.selectedLayerID = layerID;
        this.loading = true;
        this.error = null;

        try {
            const response = await fetchLogs(layerID);
            if (response && response.success) {
                const sortedLogs = response.data.sort(
                    (a: Log, b: Log) =>
                        new Date(b.transaction_datetime).getTime() -
                        new Date(a.transaction_datetime).getTime()
                );
                runInAction(() => {
                    this.logs = sortedLogs;
                    this.filteredLogs = sortedLogs;
                });
            } else {
                runInAction(() => {
                    this.error = "Failed tot fetch data: " + (response?.message || "Unknown error");
                });
            }
        } catch (err: any) {
            runInAction(() => {
                this.error = "Failed to fetch data: " + err.message;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    filterLogs() {
        this.filteredLogs = this.logs.filter((log) => {
            const value = log[this.searchField] as unknown as string;
            return value?.toLowerCase().includes(this.searchValue.toLowerCase());
        });
    }

    setSearchField(field: keyof Log) {
        this.searchField = field;
        this.filterLogs();
    }

    setSearchValue(value: string){
        this.searchValue = value;
        this.filterLogs();
    }

    async selectLog(log: Log) {
        this.selectedLog = log;
        this.isModalVisible = true;
        this.isLoadingGeometry = true;

        try {
            const geometryResponse = await fetchGeometry(log.ID, log.layerid, log.assetid);
            if (geometryResponse && geometryResponse.success) {
                const flattenCoordinates = (coords: any): { lng: number; lat: number }[] => {
                    const result: { lng: number; lat: number }[] = [];
                    const recurse = (arr: any) => {
                        if (Array.isArray(arr[0])) arr.forEach(recurse);
                        else if (typeof arr[0] === "number" && typeof arr[1] === "number")
                            result.push({ lng: arr[0], lat: arr[1]});
                    };
                    recurse(coords);
                    return result;
                };

                const formattedCoordinates = flattenCoordinates(geometryResponse.coordinates);
                runInAction(() => {
                    this.geometry = { coordinates: formattedCoordinates };
                    this.mapCenter = 
                        formattedCoordinates[0] ?? { lat: 7.0819, lng: 125.5105 };
                });
            } else {
                runInAction(() => {
                    this.geometry = null;
                });
            }
        } finally {
            runInAction(() => {
                this.isLoadingGeometry
            });
        }
    }

    closeModal() {
        this.isModalVisible = false;
        this.selectedLog = null;
        this.geometry = null;
    }
}

export const logsStore = new LogsStore();