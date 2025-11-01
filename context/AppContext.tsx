
import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { Hospital, Doctor, Patient, Cabin, FinancialRecord } from '../types';
import { generateInitialData } from '../utils/mockData';

interface AppState {
    hospitals: Hospital[];
    doctors: Doctor[];
    patients: Patient[];
    cabins: Cabin[];
    financialRecords: FinancialRecord[];
}

type Action =
    | { type: 'SET_STATE'; payload: AppState }
    | { type: 'ADD_HOSPITAL'; payload: Hospital }
    | { type: 'UPDATE_HOSPITAL'; payload: Hospital }
    | { type: 'DELETE_HOSPITAL'; payload: string }
    | { type: 'ADD_DOCTOR'; payload: Doctor }
    | { type: 'UPDATE_DOCTOR'; payload: Doctor }
    | { type: 'DELETE_DOCTOR'; payload: string }
    | { type: 'ADD_PATIENT'; payload: Patient }
    | { type: 'UPDATE_PATIENT'; payload: Patient }
    | { type: 'DELETE_PATIENT'; payload: string }
    | { type: 'ADD_CABIN'; payload: Cabin }
    | { type: 'UPDATE_CABIN'; payload: Cabin }
    | { type: 'DELETE_CABIN'; payload: string }
    | { type: 'ADD_FINANCIAL_RECORD'; payload: FinancialRecord }
    | { type: 'DELETE_FINANCIAL_RECORD'; payload: string };


const initialState: AppState = {
    hospitals: [],
    doctors: [],
    patients: [],
    cabins: [],
    financialRecords: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_STATE':
            return action.payload;
        case 'ADD_HOSPITAL':
            return { ...state, hospitals: [...state.hospitals, action.payload] };
        case 'UPDATE_HOSPITAL':
            return { ...state, hospitals: state.hospitals.map(h => h.id === action.payload.id ? action.payload : h) };
        case 'DELETE_HOSPITAL':
            return { ...state, hospitals: state.hospitals.filter(h => h.id !== action.payload) };
        case 'ADD_DOCTOR':
            return { ...state, doctors: [...state.doctors, action.payload] };
        case 'UPDATE_DOCTOR':
            return { ...state, doctors: state.doctors.map(d => d.id === action.payload.id ? action.payload : d) };
        case 'DELETE_DOCTOR':
            return { ...state, doctors: state.doctors.filter(d => d.id !== action.payload) };
        case 'ADD_PATIENT':
            return { ...state, patients: [...state.patients, action.payload] };
        case 'UPDATE_PATIENT':
            return { ...state, patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p) };
        case 'DELETE_PATIENT':
            return { ...state, patients: state.patients.filter(p => p.id !== action.payload) };
        case 'ADD_CABIN':
            return { ...state, cabins: [...state.cabins, action.payload] };
        case 'UPDATE_CABIN':
            return { ...state, cabins: state.cabins.map(c => c.id === action.payload.id ? action.payload : c) };
        case 'DELETE_CABIN':
            return { ...state, cabins: state.cabins.filter(c => c.id !== action.payload) };
        case 'ADD_FINANCIAL_RECORD':
            return { ...state, financialRecords: [...state.financialRecords, action.payload] };
        case 'DELETE_FINANCIAL_RECORD':
            return { ...state, financialRecords: state.financialRecords.filter(r => r.id !== action.payload) };
        default:
            return state;
    }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => null,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        try {
            const storedState = localStorage.getItem('hospitalManagementState');
            if (storedState) {
                dispatch({ type: 'SET_STATE', payload: JSON.parse(storedState) });
            } else {
                 const initialData = generateInitialData();
                 localStorage.setItem('hospitalManagementState', JSON.stringify(initialData));
                 dispatch({ type: 'SET_STATE', payload: initialData });
            }
        } catch (error) {
            console.error("Could not load state from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('hospitalManagementState', JSON.stringify(state));
        } catch (error) {
            console.error("Could not save state to localStorage", error);
        }
    }, [state]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
   