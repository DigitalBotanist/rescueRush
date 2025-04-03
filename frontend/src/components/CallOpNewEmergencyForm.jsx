import { useState } from "react";
import { useAddNewEmergency } from "../hooks/useAddNewEmergency";

export default function PatientForm() {
    const { makeNewEmergency, error, isLoading } = useAddNewEmergency();
    const [emergency, setEmergency] = useState({
        address: "",
        caller: { number: "", name: "" },
        details: "",
        patients: [],
        emergencyType: "",
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validateForm = () => {
        let newErrors = {};

        if (!emergency.address) newErrors.address = "Address is required";
        if (!emergency.caller.name) newErrors.callerName = "Caller name is required";
        if (!emergency.caller.number) newErrors.callerNumber = "Caller number is required";
        if (!emergency.details) newErrors.details = "Details are required";
        if (!emergency.emergencyType) newErrors.emergencyType = "Emergency type is required";
        
        emergency.patients.forEach((patient, index) => {
            if (!patient.name) newErrors[`patientName${index}`] = "Patient name is required";
            if (!patient.age) newErrors[`patientAge${index}`] = "Patient age is required";
            if (!patient.emergencyType) newErrors[`patientEmergencyType${index}`] = "Emergency type is required";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const json = await makeNewEmergency(emergency);
            console.log(json);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <div className="w-2/3 h-9/10 flex flex-col items-center mt-5 overflow-y-auto">
            <h1 className="text-2xl font-semibold text-gray-800">Emergency Details</h1>
            {submitted && (
                <div className="fixed top-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                    Details successfully submitted!
                </div>
            )}
            <div className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 mt-5 border border-gray-200">
                <label className="text-gray-600 font-medium">Address</label>
                <input
                    className="border border-gray-300 p-3 rounded-lg"
                    type="text"
                    value={emergency.address}
                    onChange={(e) => setEmergency({ ...emergency, address: e.target.value })}
                />
                {errors.address && <span className="text-red-500">{errors.address}</span>}

                <label className="text-gray-600 font-medium">Caller Name</label>
                <input
                    className="border border-gray-300 p-3 rounded-lg"
                    type="text"
                    value={emergency.caller.name}
                    onChange={(e) => setEmergency({ ...emergency, caller: { ...emergency.caller, name: e.target.value } })}
                />
                {errors.callerName && <span className="text-red-500">{errors.callerName}</span>}

                <label className="text-gray-600 font-medium">Caller Number</label>
                <input
                    className="border border-gray-300 p-3 rounded-lg"
                    type="text"
                    value={emergency.caller.number}
                    onChange={(e) => setEmergency({ ...emergency, caller: { ...emergency.caller, number: e.target.value } })}
                />
                {errors.callerNumber && <span className="text-red-500">{errors.callerNumber}</span>}
            </div>

            <button
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
}
