import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Hospitals from './pages/Hospitals';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Cabins from './pages/Cabins';
import Finance from './pages/Finance';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <AppProvider>
            <HashRouter>
                <div className="flex h-screen">
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <header className="bg-white/60 backdrop-blur-md shadow-lg border-b border-white/30 p-4 flex items-center z-10">
                            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 focus:outline-none lg:hidden">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            </button>
                             <h1 className="text-2xl font-semibold text-gray-800 ml-4">Hospital Management System</h1>
                        </header>
                        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/hospitals" element={<Hospitals />} />
                                <Route path="/doctors" element={<Doctors />} />
                                <Route path="/patients" element={<Patients />} />
                                <Route path="/cabins" element={<Cabins />} />
                                <Route path="/finance" element={<Finance />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </HashRouter>
        </AppProvider>
    );
};

export default App;