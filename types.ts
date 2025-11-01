
export interface Hospital {
    id: string;
    name: string;
    address: string;
    phone: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    phone: string;
    schedule: string;
    hospitalId: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    address: string;
    admissionDate: string;
    treatment: string;
    hospitalId: string;
    doctorId: string;
    cabinId: string | null;
}

export interface Cabin {
    id: string;
    cabinNumber: string;
    type: 'General' | 'Private' | 'ICU';
    isOccupied: boolean;
    hospitalId: string;
}

export interface FinancialRecord {
    id: string;
    type: 'Income' | 'Expense';
    description: string;
    amount: number;
    date: string; // YYYY-MM-DD
    hospitalId: string;
}
   