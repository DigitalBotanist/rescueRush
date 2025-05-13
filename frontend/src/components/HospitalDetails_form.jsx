import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle } from 'lucide-react';

const HospitalDetailsForm = () => {
    const { details, dispatch } = useHospitalDetailsContext();
    const { user } = useAuthContext();
    const [location_lat, setLocationLat] = useState("");
    const [location_long, setLocationLong] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [bed, setBed] = useState("");
    const [icu, setIcu] = useState(false);
    const [emergencyUnit, setEmergencyUnit] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (!details) return;
        setLocationLat(details.location?.lat || "");
        setLocationLong(details.location?.long || "");
        setName(details.name || "");
        setCity(details.city || "");
        setBed(details.Bed || "");
        setIcu(details.ICU || false);
        setEmergencyUnit(details.Emergency_Unit || false);
    }, [details]);

    const validateForm = () => {
        if (!location_lat || isNaN(location_lat)) return "Valid latitude is required";
        if (!location_long || isNaN(location_long)) return "Valid longitude is required";
        if (!name.trim()) return "Hospital name is required";
        if (!city.trim()) return "City is required";
        if (!bed || isNaN(bed) || bed < 0) return "Valid number of beds is required";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in");
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
            location: {
                lat: parseFloat(location_lat),
                long: parseFloat(location_long),
            },
            name,
            city,
            Bed: parseInt(bed),
            ICU: icu,
            Emergency_Unit: emergencyUnit,
        };

        try {
            const response = await fetch("/api/hospital", {
                method: "PATCH",
                body: JSON.stringify(detail),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error || "Failed to update hospital details");
                setIsSubmitting(false);
                return;
            }

            dispatch({ type: "CREATE_DETAILS", payload: json });
            setShowConfirmation(true);
            setIsSubmitting(false);
        } catch (err) {
            setError("An error occurred while updating hospital details");
            console.error("Error:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Hospital Details</h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                        <XCircle size={20} className="mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            placeholder="Enter latitude"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={location_lat}
                            onChange={(e) => setLocationLat(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            placeholder="Enter longitude"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={location_long}
                            onChange={(e) => setLocationLong(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                        <input
                            type="text"
                            placeholder="Enter hospital name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            placeholder="Enter city"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Beds</label>
                        <input
                            type="number"
                            placeholder="Enter number of beds"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={bed}
                            onChange={(e) => setBed(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <input
                                type="checkbox"
                                className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                checked={icu}
                                onChange={(e) => setIcu(e.target.checked)}
                            />
                            ICU Available
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <input
                                type="checkbox"
                                className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                checked={emergencyUnit}
                                onChange={(e) => setEmergencyUnit(e.target.checked)}
                            />
                            Emergency Unit Available
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg text-white font-medium transition ${
                            isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>

                    <Link to="/hospital" className="block text-center text-red-600 hover:text-red-700 transition">
                        Back to Dashboard
                    </Link>
                </form>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex items-center mb-4">
                            <CheckCircle size={24} className="text-green-500 mr-2" />
                            <h2 className="text-xl font-bold">Success</h2>
                        </div>
                        <p className="mb-6">Hospital details updated successfully!</p>
                        <div className="flex justify-end">
                            <Link to="/hospital">
                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                    Back to Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDetailsForm;