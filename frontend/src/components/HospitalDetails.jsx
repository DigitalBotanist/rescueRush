import { Link } from "react-router-dom";
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext";
import { Edit } from 'lucide-react';

const HospitalDetails = () => {
    const { details } = useHospitalDetailsContext();

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            {details ? (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Hospital Details</h2>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">Location:</span>
                            <span className="text-gray-800">
                                {details.location ? `${details.location.lat}, ${details.location.long}` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">Name:</span>
                            <span className="text-gray-800">{details.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">City:</span>
                            <span className="text-gray-800">{details.city || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">Beds:</span>
                            <span className="text-gray-800">{details.Bed || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">ICU:</span>
                            <span className="text-gray-800">{details.ICU ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">Emergency Unit:</span>
                            <span className="text-gray-800">{details.Emergency_Unit ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Link to="/hospital/hospital_details_form">
                            <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                <Edit size={18} className="mr-2" />
                                Update
                            </button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No hospital details found</p>
                    <Link to="/hospital/hospital_details_form" className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Add Hospital Details
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HospitalDetails;