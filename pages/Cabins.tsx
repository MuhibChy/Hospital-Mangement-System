import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Cabin } from '../types';
import Modal from '../components/Modal';
import { generateUniqueId } from '../utils/helpers';

const Cabins: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCabin, setCurrentCabin] = useState<Partial<Cabin> | null>(null);

    const handleOpenModal = (cabin?: Cabin) => {
        setCurrentCabin(cabin || { type: 'General', isOccupied: false });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentCabin(null);
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCabin || !currentCabin.cabinNumber || !currentCabin.hospitalId) return;

        if (currentCabin.id) {
            dispatch({ type: 'UPDATE_CABIN', payload: currentCabin as Cabin });
        } else {
            dispatch({ type: 'ADD_CABIN', payload: { ...currentCabin, id: generateUniqueId() } as Cabin });
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this cabin?')) {
            dispatch({ type: 'DELETE_CABIN', payload: id });
        }
    };
    
    const inputStyle = "w-full p-2 border border-black/10 rounded bg-white/50 focus:bg-white/80 focus:ring-2 focus:ring-primary outline-none transition";

    return (
        <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Cabins / Rooms</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Add Cabin</button>
            </div>

             <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-900/10">
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Cabin Number</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Type</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Hospital</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Status</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.cabins.map(cabin => {
                            const hospital = state.hospitals.find(h => h.id === cabin.hospitalId);
                            return (
                            <tr key={cabin.id} className="hover:bg-black/5 transition-colors">
                                <td className="p-4 whitespace-nowrap font-medium text-gray-800">{cabin.cabinNumber}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{cabin.type}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{hospital?.name || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${cabin.isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {cabin.isOccupied ? 'Occupied' : 'Vacant'}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => handleOpenModal(cabin)} className="font-medium text-indigo-600 hover:text-indigo-800 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(cabin.id)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentCabin?.id ? 'Edit Cabin' : 'Add Cabin'}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Cabin Number</label>
                            <input type="text" value={currentCabin?.cabinNumber || ''} onChange={e => setCurrentCabin({ ...currentCabin, cabinNumber: e.target.value })} className={inputStyle} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Type</label>
                            <select value={currentCabin?.type || 'General'} onChange={e => setCurrentCabin({ ...currentCabin, type: e.target.value as Cabin['type'] })} className={inputStyle}>
                                <option>General</option>
                                <option>Private</option>
                                <option>ICU</option>
                            </select>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 mb-1">Hospital</label>
                            <select value={currentCabin?.hospitalId || ''} onChange={e => setCurrentCabin({ ...currentCabin, hospitalId: e.target.value })} className={inputStyle} required>
                                <option value="" disabled>Select Hospital</option>
                                {state.hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div className="mb-4 col-span-2">
                             <label className="flex items-center cursor-pointer">
                                <input type="checkbox" checked={currentCabin?.isOccupied || false} onChange={e => setCurrentCabin({ ...currentCabin, isOccupied: e.target.checked })} className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary/50"/>
                                <span className="ml-2 text-gray-700">Is Occupied</span>
                            </label>
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

export default Cabins;