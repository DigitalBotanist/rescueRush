import React from 'react';
import { Link } from 'react-router-dom';
import HospitalDetails from './HospitalDetails';
import { useAuthContext } from '../hooks/useAuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function HospitalDetailsPage() {
    const currentDate = new Date().toLocaleDateString();
    const { user } = useAuthContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-red-600 text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} p-4`}>
                <div className="flex items-center justify-between mb-6">
                    {isSidebarOpen && <h1 className="text-xl font-semibold">{user.firstName} {user.lastName}</h1>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-red-700">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <nav className="flex flex-col space-y-2">
                    <Link to="/hospital/HospitalStaffDashBoard" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Doctor Details</span>}
                        {!isSidebarOpen && <span className="text-xl">📋</span>}
                    </Link>

                    <Link to="/hospital/HospitalDetail" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Hospital Details</span>}
                        {!isSidebarOpen && <span className="text-xl">🏥</span>}
                    </Link>
                    <Link to="/hospital/Report" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Report</span>}
                        {!isSidebarOpen && <span className="text-xl">📊</span>}
                    </Link>
                    <Link to="/hospital/ChatWindow" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Chat Window</span>}
                        {!isSidebarOpen && <span className="text-xl">💬</span>}
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Hospital Details</h1>
                    <span className="text-gray-600">{currentDate}</span>
                </div>

                <div className="max-w-4xl">
                    <HospitalDetails />
                </div>
            </div>
        </div>
    );
}

export default HospitalDetailsPage;