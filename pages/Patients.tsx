import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Patient, Doctor, Hospital } from '../types';
import Modal from '../components/Modal';
import { generateUniqueId } from '../utils/helpers';
import { generatePatientSummary } from '../services/geminiService';

const Patients: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
    const [currentPatient, setCurrentPatient] = useState<Partial<Patient> | null>(null);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [summary, setSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);


    const handleOpenModal = (patient?: Patient) => {
        setCurrentPatient(patient || { gender: 'Male' });
        if(patient?.hospitalId) {
            setFilteredDoctors(state.doctors.filter(d => d.hospitalId === patient.hospitalId));
        } else {
            setFilteredDoctors([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentPatient(null);
        setIsModalOpen(false);
    };

    const handleHospitalChange = (hospitalId: string) => {
        setCurrentPatient({ ...currentPatient, hospitalId, doctorId: '', cabinId: null });
        setFilteredDoctors(state.doctors.filter(d => d.hospitalId === hospitalId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPatient || !currentPatient.name || !currentPatient.hospitalId || !currentPatient.doctorId) return;

        if (currentPatient.id) {
            dispatch({ type: 'UPDATE_PATIENT', payload: currentPatient as Patient });
        } else {
            dispatch({ type: 'ADD_PATIENT', payload: { ...currentPatient, id: generateUniqueId() } as Patient });
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to discharge this patient?')) {
            dispatch({ type: 'DELETE_PATIENT', payload: id });
        }
    };

    const handleGenerateSummary = async (patient: Patient) => {
        const doctor = state.doctors.find(d => d.id === patient.doctorId);
        const hospital = state.hospitals.find(h => h.id === patient.hospitalId);
        if (!doctor || !hospital) {
            alert("Doctor or Hospital not found for this patient.");
            return;
        }
        setSummaryModalOpen(true);
        setIsLoadingSummary(true);
        setSummary('');
        const result = await generatePatientSummary(patient, doctor, hospital);
        setSummary(result);
        setIsLoadingSummary(false);
    };

    const availableCabins = useMemo(() => {
        if (!currentPatient?.hospitalId) return [];
        return state.cabins.filter(c => c.hospitalId === currentPatient.hospitalId && !c.isOccupied);
    }, [currentPatient?.hospitalId, state.cabins]);
    
    const inputStyle = "w-full p-2 border border-black/10 rounded bg-white/50 focus:bg-white/80 focus:ring-2 focus:ring-primary outline-none transition";

    return (
        <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Patients</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Admit Patient</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                     <thead>
                        <tr className="border-b border-gray-900/10">
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Name</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Age</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Hospital</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Doctor</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Cabin</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.patients.map(patient => {
                            const hospital = state.hospitals.find(h => h.id === patient.hospitalId);
                            const doctor = state.doctors.find(d => d.id === patient.doctorId);
                            const cabin = state.cabins.find(c => c.id === patient.cabinId);
                            return (
                            <tr key={patient.id} className="hover:bg-black/5 transition-colors">
                                <td className="p-4 whitespace-nowrap font-medium text-gray-800">{patient.name}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{patient.age}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{hospital?.name || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{doctor?.name || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{cabin?.cabinNumber || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => handleGenerateSummary(patient)} className="font-medium text-blue-600 hover:text-blue-800 mr-4">AI Summary</button>
                                    <button onClick={() => handleOpenModal(patient)} className="font-medium text-indigo-600 hover:text-indigo-800 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(patient.id)} className="font-medium text-red-600 hover:text-red-800">Discharge</button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentPatient?.id ? 'Edit Patient' : 'Admit Patient'}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Name</label>
                            <input type="text" value={currentPatient?.name || ''} onChange={e => setCurrentPatient({ ...currentPatient, name: e.target.value })} className={inputStyle} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Age</label>
                            <input type="number" value={currentPatient?.age || ''} onChange={e => setCurrentPatient({ ...currentPatient, age: parseInt(e.target.value) || 0 })} className={inputStyle} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Gender</label>
                            <select value={currentPatient?.gender || 'Male'} onChange={e => setCurrentPatient({ ...currentPatient, gender: e.target.value as Patient['gender'] })} className={inputStyle}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Phone</label>
                            <input type="text" value={currentPatient?.phone || ''} onChange={e => setCurrentPatient({ ...currentPatient, phone: e.target.value })} className={inputStyle} />
                        </div>
                         <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 mb-1">Address</label>
                            <input type="text" value={currentPatient?.address || ''} onChange={e => setCurrentPatient({ ...currentPatient, address: e.target.value })} className={inputStyle} />
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Admission Date</label>
                            <input type="date" value={currentPatient?.admissionDate || ''} onChange={e => setCurrentPatient({ ...currentPatient, admissionDate: e.target.value })} className={inputStyle} required/>
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Hospital</label>
                            <select value={currentPatient?.hospitalId || ''} onChange={e => handleHospitalChange(e.target.value)} className={inputStyle} required>
                                <option value="" disabled>Select Hospital</option>
                                {state.hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Assign Doctor</label>
                            <select value={currentPatient?.doctorId || ''} onChange={e => setCurrentPatient({ ...currentPatient, doctorId: e.target.value })} className={inputStyle} required disabled={!currentPatient?.hospitalId}>
                                <option value="" disabled>Select Doctor</option>
                                {filteredDoctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                            </select>
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Assign Cabin</label>
                            <select value={currentPatient?.cabinId || ''} onChange={e => setCurrentPatient({ ...currentPatient, cabinId: e.target.value || null })} className={inputStyle} disabled={!currentPatient?.hospitalId}>
                                <option value="">No Cabin</option>
                                {availableCabins.map(c => <option key={c.id} value={c.id}>{c.cabinNumber} ({c.type})</option>)}
                            </select>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 mb-1">Treatment Notes</label>
                            <textarea value={currentPatient?.treatment || ''} onChange={e => setCurrentPatient({ ...currentPatient, treatment: e.target.value })} className={`${inputStyle} h-24`} rows={4}></textarea>
                        </div>

                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-all">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Save</button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={isSummaryModalOpen} onClose={() => setSummaryModalOpen(false)} title="AI-Generated Patient Summary">
                 {isLoadingSummary ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    </div>
                 ) : (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{summary}</div>
                 )}
            </Modal>
        </div>
    );
};

export default Patients;