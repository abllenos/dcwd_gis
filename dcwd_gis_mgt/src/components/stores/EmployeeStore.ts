import { makeAutoObservable, runInAction } from "mobx";

export interface Employee {
    EmpId: string;
    FirstName: string;
    LastName: string;
    MiddleName: string;
    Sex: number;
    computed1: string;
}

class EmployeeStore {
    employees: Employee[] = [];
    filteredEmployees: Employee [] = [];
    loading: boolean = true;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchEmployees() {
        this.loading = true;
        this.error = null;

        try {
            const response = await fetch(
                "http://192.100.140.198/api/react/gismgt/employee.php"
            );

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result: Employee[] = await response.json();

            runInAction(() => {
                this.employees = result;
                this.filteredEmployees = result;
                this.loading = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message;
                this.loading = false;
            })
        }
    }

    search(value: string) {
        const lowercasedValue = value.toLowerCase();
        this.filteredEmployees = this.employees.filter((employee) =>
            Object.values(employee).some(
                (field) =>
                    field &&
                    field.toString().toLowerCase().includes(lowercasedValue)
            )
        );
    }
}

export const employeeStore = new EmployeeStore();