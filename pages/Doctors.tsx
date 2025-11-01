import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Doctor } from '../types';
import Modal from '../components/Modal';
import { generateUniqueId } from '../utils/helpers';

const Doctors: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<Partial<Doctor> | null>(null);

    const handleOpenModal = (doctor?: Doctor) => {
        setCurrentDoctor(doctor || {});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentDoctor(null);
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDoctor || !currentDoctor.name || !currentDoctor.hospitalId) return;

        if (currentDoctor.id) {
            dispatch({ type: 'UPDATE_DOCTOR', payload: currentDoctor as Doctor });
        } else {
            dispatch({ type: 'ADD_DOCTOR', payload: { ...currentDoctor, id: generateUniqueId() } as Doctor });
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            dispatch({ type: 'DELETE_DOCTOR', payload: id });
        }
    };
    
    const inputStyle = "w-full p-2 border border-black/10 rounded bg-white/50 focus:bg-white/80 focus:ring-2 focus:ring-primary outline-none transition";

    return (
        <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Doctors</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Add Doctor</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                         <tr className="border-b border-gray-900/10">
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Name</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Specialization</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Hospital</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Schedule</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Phone</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.doctors.map(doctor => {
                            const hospital = state.hospitals.find(h => h.id === doctor.hospitalId);
                            return (
                            <tr key={doctor.id} className="hover:bg-black/5 transition-colors">
                                <td className="p-4 whitespace-nowrap font-medium text-gray-800">{doctor.name}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{doctor.specialization}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{hospital?.name || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{doctor.schedule}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{doctor.phone}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => handleOpenModal(doctor)} className="font-medium text-indigo-600 hover:text-indigo-800 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(doctor.id)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentDoctor?.id ? 'Edit Doctor' : 'Add Doctor'}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Name</label>
                            <input type="text" value={currentDoctor?.name || ''} onChange={e => setCurrentDoctor({ ...currentDoctor, name: e.target.value })} className={inputStyle} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Specialization</label>
                            <input type="text" value={currentDoctor?.specialization || ''} onChange={e => setCurrentDoctor({ ...currentDoctor, specialization: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Phone</label>
                            <input type="text" value={currentDoctor?.phone || ''} onChange={e => setCurrentDoctor({ ...currentDoctor, phone: e.target.value })} className={inputStyle} />
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Hospital</label>
                            <select value={currentDoctor?.hospitalId || ''} onChange={e => setCurrentDoctor({ ...currentDoctor, hospitalId: e.target.value })} className={inputStyle} required>
                                <option value="" disabled>Select Hospital</option>
                                {state.hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 mb-1">Visiting Schedule</label>
                            <input type="text" value={currentDoctor?.schedule || ''} onChange={e => setCurrentDoctor({ ...currentDoctor, schedule: e.target.value })} className={inputStyle} placeholder="e.g., Sat-Thu, 10am-5pm"/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-all">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Doctors;