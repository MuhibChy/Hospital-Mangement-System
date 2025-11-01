import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { to: '/hospitals', label: 'Hospitals', icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 14.707a1 1 0 001.414 0L12 12.828l1.879 1.879a1 1 0 001.414-1.414L13.414 11.4l1.879-1.879a1 1 0 00-1.414-1.414L12 10.586l-1.879-1.879a1 1 0 00-1.414 1.414L10.586 11.4l-1.879 1.879a1 1 0 000 1.414z' },
    { to: '/doctors', label: 'Doctors', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { to: '/patients', label: 'Patients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1-3.61' },
    { to: '/cabins', label: 'Cabins', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { to: '/finance', label: 'Finance', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M13 21.945A9.001 9.001 0 103.055 11H13v10.945z' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const activeLink = "flex items-center px-4 py-2 mt-5 text-gray-100 bg-primary-focus rounded-lg shadow-md";
    const inactiveLink = "flex items-center px-4 py-2 mt-5 text-gray-300 transition-colors duration-300 transform rounded-lg hover:bg-gray-700/50 hover:text-gray-100";

    return (
        <>
            <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`transform top-0 left-0 w-64 bg-neutral/90 backdrop-blur-lg text-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
                <div className="flex items-center justify-center mt-8">
                    <div className="flex items-center">
                         <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-white text-2xl mx-2 font-semibold">HMS</span>
                    </div>
                </div>
                <nav className="mt-10 px-2">
                    {navItems.map(item => (
                        <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? activeLink : inactiveLink} onClick={() => setIsOpen(false)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                            </svg>
                            <span className="mx-4 font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;