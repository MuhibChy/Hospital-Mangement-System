
import { Hospital, Doctor, Patient, Cabin, FinancialRecord } from '../types';
import { generateUniqueId } from './helpers';

export const generateInitialData = () => {
    const hospital1Id = generateUniqueId();
    const hospital2Id = generateUniqueId();

    const hospitals: Hospital[] = [
        { id: hospital1Id, name: 'Dhaka Central Hospital', address: 'Dhanmondi, Dhaka', phone: '01712345678' },
        { id: hospital2Id, name: 'Chittagong Medical Center', address: 'Panchlaish, Chittagong', phone: '01812345678' },
    ];

    const doctor1Id = generateUniqueId();
    const doctor2Id = generateUniqueId();
    const doctor3Id = generateUniqueId();

    const doctors: Doctor[] = [
        { id: doctor1Id, name: 'Abul Kalam', specialization: 'Cardiologist', phone: '01911112222', schedule: 'Sat-Thu, 10am-5pm', hospitalId: hospital1Id },
        { id: doctor2Id, name: 'Fatima Begum', specialization: 'Gynecologist', phone: '01622223333', schedule: 'Sun-Wed, 9am-2pm', hospitalId: hospital1Id },
        { id: doctor3Id, name: 'Rahim Sheikh', specialization: 'Orthopedic Surgeon', phone: '01533334444', schedule: 'Mon-Fri, 3pm-8pm', hospitalId: hospital2Id },
    ];

    const cabin1Id = generateUniqueId();
    const cabin2Id = generateUniqueId();
    const cabin3Id = generateUniqueId();

    const cabins: Cabin[] = [
        { id: cabin1Id, cabinNumber: 'C-101', type: 'Private', isOccupied: true, hospitalId: hospital1Id },
        { id: generateUniqueId(), cabinNumber: 'C-102', type: 'Private', isOccupied: false, hospitalId: hospital1Id },
        { id: cabin2Id, cabinNumber: 'G-201', type: 'General', isOccupied: true, hospitalId: hospital1Id },
        { id: cabin3Id, cabinNumber: 'ICU-1', type: 'ICU', isOccupied: true, hospitalId: hospital2Id },
        { id: generateUniqueId(), cabinNumber: 'P-305', type: 'Private', isOccupied: false, hospitalId: hospital2Id },
    ];
    
    const patients: Patient[] = [
        { id: generateUniqueId(), name: 'Jamal Uddin', age: 55, gender: 'Male', phone: '017xxxxxxx1', address: 'Mirpur, Dhaka', admissionDate: '2023-10-01', treatment: 'Patient admitted with chest pain. ECG shows minor abnormalities. Prescribed medication and advised for 2-day observation.', hospitalId: hospital1Id, doctorId: doctor1Id, cabinId: cabin1Id },
        { id: generateUniqueId(), name: 'Ayesha Akhter', age: 28, gender: 'Female', phone: '018xxxxxxx2', address: 'Mohammadpur, Dhaka', admissionDate: '2023-10-02', treatment: 'Routine pregnancy check-up. Everything is normal. Fetal heartbeat is strong.', hospitalId: hospital1Id, doctorId: doctor2Id, cabinId: cabin2Id },
        { id: generateUniqueId(), name: 'Harun Mia', age: 42, gender: 'Male', phone: '016xxxxxxx3', address: 'Agrabad, Chittagong', admissionDate: '2023-09-28', treatment: 'Admitted for surgery on a fractured tibia. Post-op recovery is satisfactory. Physiotherapy recommended.', hospitalId: hospital2Id, doctorId: doctor3Id, cabinId: cabin3Id },
    ];
    
    const financialRecords: FinancialRecord[] = [
        { id: generateUniqueId(), type: 'Income', description: 'Patient Admission Fee - Jamal Uddin', amount: 5000, date: '2023-10-01', hospitalId: hospital1Id },
        { id: generateUniqueId(), type: 'Expense', description: 'October Staff Salaries', amount: 500000, date: '2023-10-01', hospitalId: hospital1Id },
        { id: generateUniqueId(), type: 'Income', description: 'Cabin Rent - C-101', amount: 15000, date: '2023-10-02', hospitalId: hospital1Id },
        { id: generateUniqueId(), type: 'Expense', description: 'Medical Equipment Purchase', amount: 120000, date: '2023-09-25', hospitalId: hospital1Id },
        { id: generateUniqueId(), type: 'Income', description: 'Surgery Bill - Harun Mia', amount: 80000, date: '2023-09-28', hospitalId: hospital2Id },
        { id: generateUniqueId(), type: 'Expense', description: 'Medicine Supply Order', amount: 75000, date: '2023-09-30', hospitalId: hospital2Id },
    ];

    return { hospitals, doctors, patients, cabins, financialRecords };
};
   