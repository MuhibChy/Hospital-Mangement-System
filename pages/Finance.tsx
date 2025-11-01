import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { FinancialRecord } from '../types';
import Modal from '../components/Modal';
import { generateUniqueId } from '../utils/helpers';

const Finance: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<Partial<FinancialRecord> | null>(null);
    const [filterHospital, setFilterHospital] = useState<string>('all');
    
    const handleOpenModal = (record?: FinancialRecord) => {
        setCurrentRecord(record || { type: 'Income', date: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentRecord(null);
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRecord || !currentRecord.description || !currentRecord.amount || !currentRecord.hospitalId) return;

        // No edit for finance, only add/delete
        dispatch({ type: 'ADD_FINANCIAL_RECORD', payload: { ...currentRecord, id: generateUniqueId() } as FinancialRecord });
        
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
            dispatch({ type: 'DELETE_FINANCIAL_RECORD', payload: id });
        }
    };

    const filteredRecords = useMemo(() => {
        return state.financialRecords
            .filter(record => filterHospital === 'all' || record.hospitalId === filterHospital)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [state.financialRecords, filterHospital]);

    const totalIncome = filteredRecords.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = filteredRecords.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
    const netTotal = totalIncome - totalExpense;
    
    const inputStyle = "w-full p-2 border border-black/10 rounded bg-white/50 focus:bg-white/80 focus:ring-2 focus:ring-primary outline-none transition";

    return (
        <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Finance Management</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Add Record</button>
            </div>

            <div className="mb-6 bg-white/50 p-4 rounded-lg flex items-center space-x-4">
                <label htmlFor="hospitalFilter" className="font-medium text-gray-700">Filter by Hospital:</label>
                <select id="hospitalFilter" value={filterHospital} onChange={e => setFilterHospital(e.target.value)} className="p-2 border border-black/10 rounded bg-white/50 focus:ring-2 focus:ring-primary outline-none transition">
                    <option value="all">All Hospitals</option>
                    {state.hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-500/10 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-800">Total Income</h4>
                    <p className="text-2xl font-bold text-green-900">৳{totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-red-500/10 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-800">Total Expense</h4>
                    <p className="text-2xl font-bold text-red-900">৳{totalExpense.toLocaleString()}</p>
                </div>
                 <div className={`${netTotal >= 0 ? 'bg-blue-500/10' : 'bg-yellow-500/10'} p-4 rounded-lg`}>
                    <h4 className={`text-lg font-semibold ${netTotal >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>Net Total</h4>
                    <p className={`text-2xl font-bold ${netTotal >= 0 ? 'text-blue-900' : 'text-yellow-900'}`}>৳{netTotal.toLocaleString()}</p>
                </div>
            </div>

             <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-900/10">
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Date</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Description</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Hospital</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Type</th>
                            <th className="p-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-600">Amount (BDT)</th>
                            <th className="p-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map(record => {
                            const hospital = state.hospitals.find(h => h.id === record.hospitalId);
                            return (
                            <tr key={record.id} className="hover:bg-black/5 transition-colors">
                                <td className="p-4 whitespace-nowrap text-gray-600">{record.date}</td>
                                <td className="p-4 whitespace-nowrap font-medium text-gray-800">{record.description}</td>
                                <td className="p-4 whitespace-nowrap text-gray-600">{hospital?.name || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                     <span className={`font-semibold ${record.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {record.type}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-mono text-gray-800">{record.amount.toLocaleString()}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => handleDelete(record.id)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add Financial Record">
                <form onSubmit={handleSubmit}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Type</label>
                            <select value={currentRecord?.type || 'Income'} onChange={e => setCurrentRecord({ ...currentRecord, type: e.target.value as FinancialRecord['type'] })} className={inputStyle} required>
                                <option>Income</option>
                                <option>Expense</option>
                            </select>
                        </div>
                        <div className="mb-4">
                             <label className="block text-gray-700 mb-1">Amount (BDT)</label>
                            <input type="number" value={currentRecord?.amount || ''} onChange={e => setCurrentRecord({ ...currentRecord, amount: parseFloat(e.target.value) || 0 })} className={inputStyle} required />
                        </div>
                         <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 mb-1">Hospital</label>
                            <select value={currentRecord?.hospitalId || ''} onChange={e => setCurrentRecord({ ...currentRecord, hospitalId: e.target.value })} className={inputStyle} required>
                                <option value="" disabled>Select Hospital</option>
                                {state.hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                         <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 mb-1">Description</label>
                            <input type="text" value={currentRecord?.description || ''} onChange={e => setCurrentRecord({ ...currentRecord, description: e.target.value })} className={inputStyle} required />
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Date</label>
                            <input type="date" value={currentRecord?.date || ''} onChange={e => setCurrentRecord({ ...currentRecord, date: e.target.value })} className={inputStyle} required />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-all">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus shadow-md hover:shadow-lg transition-all">Save Record</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Finance;