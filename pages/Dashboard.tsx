import React from 'react';
import StatCard from '../components/StatCard';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Add type for monthly financial data to ensure type safety with recharts
type MonthlyFinancialData = { month: string; income: number; expense: number };

const Dashboard: React.FC = () => {
    const { state } = useAppContext();
    const { hospitals, doctors, patients, cabins, financialRecords } = state;

    const availableCabins = cabins.filter(c => !c.isOccupied).length;

    // Fix: Explicitly define the accumulator type for the reduce function to ensure correct type inference.
    const monthlyFinancials = financialRecords.reduce<{[key: string]: MonthlyFinancialData}>((acc, record) => {
        const month = new Date(record.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = { month, income: 0, expense: 0 };
        }
        if (record.type === 'Income') {
            acc[month].income += record.amount;
        } else {
            acc[month].expense += record.amount;
        }
        return acc;
    }, {});
    
    // Fix: Add type assertion for Object.values to fix type inference issue with sort.
    const chartData = (Object.values(monthlyFinancials) as MonthlyFinancialData[]).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Hospitals" value={hospitals.length} color="bg-blue-100 text-blue-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                <StatCard title="Total Doctors" value={doctors.length} color="bg-green-100 text-green-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                <StatCard title="Active Patients" value={patients.length} color="bg-indigo-100 text-indigo-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1-3.61" /></svg>} />
                <StatCard title="Available Cabins" value={availableCabins} color="bg-amber-100 text-amber-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>} />
            </div>

            <div className="mt-8 bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Financial Summary</h3>
                 <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '0.75rem' }} />
                        <Legend />
                        <Bar dataKey="income" fill="#10B981" name="Income (BDT)" />
                        <Bar dataKey="expense" fill="#EF4444" name="Expense (BDT)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;