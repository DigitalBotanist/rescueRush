import { Link } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

const HospitalStaffDashBoard = () => {
    const currentDate = new Date().toLocaleDateString();
    const [doctordetails, setdoctordetails] = useState(null);
    const [filteredDoctors, setFilteredDoctors] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchdoctordetails = async () => {
            try {
                const response = await fetch('/api/hospital/doctor_details/', {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    },
                });
                const json = await response.json();

                if (!response.ok) {
                    console.log("Error:", json);
                    return;
                }

                setdoctordetails(json);
                setFilteredDoctors(json);
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };
        fetchdoctordetails();
    }, [user]);

    useEffect(() => {
        if (doctordetails) {
            setFilteredDoctors(
                doctordetails.filter(doctor =>
                    `${doctor.fname} ${doctor.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    doctor.special.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, doctordetails]);

    const handleDelete = async (doctorId) => {
        if (!user) return;

        try {
            const response = await fetch(`/api/hospital/doctor_details/${doctorId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.log("Error deleting doctor:", await response.json());
                return;
            }

            setdoctordetails(doctordetails.filter(doc => doc._id !== doctorId));
            setShowDeleteModal(false);
            console.log("Doctor deleted successfully");
        } catch (error) {
            console.error("Error deleting doctor:", error);
        }
    };

    const confirmDelete = (doctor) => {
        setDoctorToDelete(doctor);
        setShowDeleteModal(true);
    };

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
                    <Link to="/hospital/AmbulanceArrivalTime" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Ambulance Arrival</span>}
                        {!isSidebarOpen && <span className="text-xl">🚑</span>}
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
                    <h1 className="text-2xl font-bold text-gray-800">Doctor Details</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{currentDate}</span>
                        <Link to="/hospital/add_doctor_details">
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
                                <span className="mr-2">+</span> Add Doctor
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialty..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Doctor List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {filteredDoctors && filteredDoctors.map((doctordetail) => (
                        <div key={doctordetail._id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition rounded-lg">
                            <div className="flex-1">
                                <p className="text-lg font-medium text-gray-800">{doctordetail.fname} {doctordetail.lname}</p>
                                <p className="text-sm text-gray-600">{doctordetail.special}</p>
                            </div>
                            <p className="text-sm text-gray-600">{doctordetail.time}</p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => confirmDelete(doctordetail)}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                                >
                                    Delete
                                </button>
                                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                                    Request
                                </button>
                            </div>
                        </div>
                    ))}
                    {!filteredDoctors && (
                        <p className="text-gray-600 text-center py-4">Loading doctor details...</p>
                    )}
                    {filteredDoctors && filteredDoctors.length === 0 && (
                        <p className="text-gray-600 text-center py-4">No doctors found.</p>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete {doctorToDelete.fname} {doctorToDelete.lname}?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(doctorToDelete._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalStaffDashBoard;