import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHospitalDetailsContext } from '../hooks/useHospitalDetailContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AddHospitalReportDetails() {
    const { details, dispatch } = useHospitalDetailsContext();
    const { user } = useAuthContext();

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [guardian, setGuardian] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [ambulanceID, setAmbulanceID] = useState("");
    const [firstAid, setFirstAid] = useState("");
    const [disease, setDisease] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const validateForm = () => {
        if (!fname.trim()) return 'First name is required';
        if (!lname.trim()) return 'Last name is required';
        if (!guardian.trim()) return 'Guardian name is required';
        if (!doctorName.trim()) return 'Doctor name is required';
        if (!ambulanceID.trim()) return 'Ambulance ID is required';
        if (!firstAid.trim()) return 'First aid information is required';
        if (!disease.trim()) return 'Disease information is required';
        if (!symptoms.trim()) return 'Symptoms information is required';
        return null;
    };

    const handleSubmit = async () => {
        if (!user) {
            setError('Please log in to add report details');
            return;
        }

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const detail = {
            fname,
            lname,
            guardian,
            DoctorName: doctorName,
            AmbulanceID: ambulanceID,
            FirstAid: firstAid,
            Disease: disease,
            Symptoms: symptoms,
            hospital_id: details._id
        };

        try {
            const response = await fetch("/api/hospital/hospitalRepoet", {
                method: "POST",
                body: JSON.stringify(detail),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const json = await response.json();

            if (!response.ok) {
                setError('Failed to add report details');
                console.log('Error:', json);
                setIsSubmitting(false);
                return;
            }

            dispatch({ type: "CREATE_DETAILS", payload: json });
            setShowConfirmation(true);
            setIsSubmitting(false);
        } catch (err) {
            setError('An error occurred while adding report details');
            console.error('Error:', err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Hospital Report</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                        <XCircle size={20} className="mr-2" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            placeholder="Enter first name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter last name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input
                            type="text"
                            placeholder="Enter guardian name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={guardian}
                            onChange={(e) => setGuardian(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                        <input
                            type="text"
                            placeholder="Enter doctor name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={doctorName}
                            onChange={(e) => setDoctorName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ambulance ID</label>
                        <input
                            type="text"
                            placeholder="Enter ambulance ID"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={ambulanceID}
                            onChange={(e) => setAmbulanceID(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Aid</label>
                        <input
                            type="text"
                            placeholder="Enter first aid details"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={firstAid}
                            onChange={(e) => setFirstAid(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
                        <input
                            type="text"
                            placeholder="Enter disease"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={disease}
                            onChange={(e) => setDisease(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                        <input
                            type="text"
                            placeholder="Enter symptoms"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg text-white font-medium transition ${
                            isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>

                    <Link to="/hospital/Report" className="block text-center text-red-600 hover:text-red-700 transition">
                        Back to Reports
                    </Link>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex items-center mb-4">
                            <CheckCircle size={24} className="text-green-500 mr-2" />
                            <h2 className="text-xl font-bold">Success</h2>
                        </div>
                        <p className="mb-6">Report added successfully!</p>
                        <div className="flex justify-end">
                            <Link to="/hospital/Report">
                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                    Back to Reports
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}