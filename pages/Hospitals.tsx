import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Hospital } from '../types';
import Modal from '../components/Modal';
import { generateUniqueId } from '../utils/helpers';

const Hospitals: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHospital, setCurrentHospital] = useState<Partial<Hospital> | null>(null);

    const handleOpenModal = (hospital?: Hospital) => {
        setCurrentHospital(hospital || {});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentHospital(null);
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentHospital || !currentHospital.name) return;

        if (currentHospital.id) {
            dispatch({ type: 'UPDATE_HOSPITAL', payload: currentHospital as Hospital });
        } else {
            dispatch({ type: 'ADD_HOSPITAL', payload: { ...currentHospital, id: generateUniqueId() } as Hospital });
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this hospital? This will also delete related doctors, patients, etc.')) {
            // In a real app, cascade deletes would be handled by the backend.
            // Here we just delete the hospital for simplicity.
            dispatch({ type: 'DELETE_HOSPITAL', payload: id });
        }
    };
    
    const inputStyle = "w-full p-2 border border-black/10 rounded bg-white/50 focus:bg-white/80 focus:ring-2 focus:ring-primary outline-none transition";

    return (
        <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Hospitals</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Add Hospital</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-900/10">
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Name</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Address</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Phone</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.hospitals.map(hospital => (
                            <tr key={hospital.id} className="hover:bg-black/5 transition-colors">
                                <td className="p-4 whitespace-nowrap font-medium text-gray-800">{hospital.name}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{hospital.address}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{hospital.phone}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => handleOpenModal(hospital)} className="font-medium text-indigo-600 hover:text-indigo-800 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(hospital.id)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentHospital?.id ? 'Edit Hospital' : 'Add Hospital'}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input type="text" value={currentHospital?.name || ''} onChange={e => setCurrentHospital({ ...currentHospital, name: e.target.value })} className={inputStyle} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Address</label>
                        <input type="text" value={currentHospital?.address || ''} onChange={e => setCurrentHospital({ ...currentHospital, address: e.target.value })} className={inputStyle} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Phone</label>
                        <input type="text" value={currentHospital?.phone || ''} onChange={e => setCurrentHospital({ ...currentHospital, phone: e.target.value })} className={inputStyle} />
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

export default Hospitals;