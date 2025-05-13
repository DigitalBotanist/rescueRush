import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Menu, X, Download, Trash2 } from 'lucide-react';

function HospitalReport() {
    const currentDate = new Date().toLocaleDateString();
    const [hospitalReports, setHospitalReports] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchHospitalReport = async () => {
            try {
                const response = await fetch('/api/hospital/hospitalRepoet/', {
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
                setHospitalReports(json);
            } catch (error) {
                console.error("Error fetching Report details:", error);
            }
        };
        fetchHospitalReport();
    }, [user]);

    const handleDelete = async (reportId) => {
        if (!user) return;
        try {
            const response = await fetch(`/api/hospital/hospitalRepoet/${reportId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.log("Error deleting report:", await response.json());
                return;
            }

            setHospitalReports(hospitalReports.filter(report => report._id !== reportId));
            setShowDeleteModal(false);
            console.log("Report deleted successfully");
        } catch (error) {
            console.error("Error deleting Report:", error);
        }
    };

    const generateSinglePdf = (report) => {
        const doc = new jsPDF("portrait");
        doc.text("Hospital Report", 14, 10);

        const tableData = [
            ['First Name', report.fname],
            ['Last Name', report.lname],
            ['Guardian', report.guardian],
            ['Ambulance ID', report.AmbulanceID],
            ['Doctor Name', report.DoctorName],
            ['Disease', report.Disease],
            ['First Aid', report.FirstAid],
            ['Symptoms', report.Symptoms]
        ];

        autoTable(doc, {
            startY: 20,
            body: tableData,
            theme: 'grid',
            styles: { halign: 'left' }
        });

        doc.save(`${report.fname}_${report.lname}_Report.pdf`);
    };

    //confirmation pop up before deleting
    const confirmDelete = (report) => {
        setReportToDelete(report);
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
                    <h1 className="text-2xl font-bold text-gray-800">Hospital Reports</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{currentDate}</span>
                        <Link to="/hospital/hospitalRepoet">
                            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
                                <span className="mr-2">+</span> Add Report
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Report List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {hospitalReports && hospitalReports.map((hospitalReport) => (
                        <div key={hospitalReport._id} className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600"><strong>ID:</strong> {hospitalReport._id}</p>
                                    <p className="text-lg font-medium text-gray-800">{hospitalReport.fname} {hospitalReport.lname}</p>
                                    <p className="text-sm text-gray-600"><strong>Guardian:</strong> {hospitalReport.guardian}</p>
                                    <p className="text-sm text-gray-600"><strong>Doctor:</strong> {hospitalReport.DoctorName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600"><strong>Ambulance ID:</strong> {hospitalReport.AmbulanceID}</p>
                                    <p className="text-sm text-gray-600"><strong>First Aid:</strong> {hospitalReport.FirstAid}</p>
                                    <p className="text-sm text-gray-600"><strong>Disease:</strong> {hospitalReport.Disease}</p>
                                    <p className="text-sm text-gray-600"><strong>Symptoms:</strong> {hospitalReport.Symptoms}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => generateSinglePdf(hospitalReport)}
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    <Download size={18} className="mr-2" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => confirmDelete(hospitalReport)}
                                    className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                                >
                                    <Trash2 size={18} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {!hospitalReports && (
                        <p className="text-gray-600 text-center py-4">Loading reports...</p>
                    )}
                    {hospitalReports && hospitalReports.length === 0 && (
                        <p className="text-gray-600 text-center py-4">No reports found.</p>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete the report for {reportToDelete.fname} {reportToDelete.lname}?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(reportToDelete._id)}
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
}

export default HospitalReport;
