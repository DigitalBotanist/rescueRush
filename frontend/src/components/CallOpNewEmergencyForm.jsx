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

    const addPatient = () => {
        setEmergency((prev) => ({
            ...prev,
            patients: [
                ...prev.patients,
                { name: "", age: "", emergencyType: "", details: "" },
            ],
        }));
    };

    const removePatient = (index) => {
        setEmergency((prev) => ({
            ...prev,
            patients: prev.patients.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (e, field, index = null) => {
        const { value } = e.target;
        if (index !== null) {
            setEmergency((prev) => {
                const patients = [...prev.patients];
                patients[index] = { ...patients[index], [field]: value };
                return { ...prev, patients };
            });
        } else if (field.includes("caller.")) {
            setEmergency((prev) => ({
                ...prev,
                caller: { ...prev.caller, [field.split(".")[1]]: value },
            }));
        } else {
            setEmergency((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async () => {
        const json = await makeNewEmergency(emergency);
        console.log(json);
    };

    return (
        <div className="w-2/3 h-9/10 flex flex-col items-center mt-5 overflow-y-auto">
            <h1 className="text-2xl font-semibold text-gray-800">
                Emergency Details
            </h1>
            <div className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 mt-5 border border-gray-200">
                <label className="text-gray-600 font-medium">Address</label>
                <input
                    className="border border-gray-300 p-3 rounded-lg"
                    type="text"
                    value={emergency.address}
                    onChange={(e) => handleChange(e, "address")}
                />
                <label className="text-gray-600 font-medium">Caller Name</label>
                <input
                    className="border border-gray-300 p-3 rounded-lg"
                    type="text"
                    value={emergency.caller.name}
                    onChange={(e) => handleChange(e, "caller.name")}
                />
                <label className="text-gray-600 font-medium">
                    Caller Number
                </label>
                <input
                    className="border border-gray-300 p-3 rounded-lg"
                    type="text"
                    value={emergency.caller.number}
                    onChange={(e) => handleChange(e, "caller.number")}
                />
                <label className="text-gray-600 font-medium">Details</label>
                <textarea
                    className="border border-gray-300 p-3 rounded-lg h-24"
                    value={emergency.details}
                    onChange={(e) => handleChange(e, "details")}
                ></textarea>
                <label className="text-gray-600 font-medium">
                    Emergency Type
                </label>
                <select
                    className="border border-gray-300 p-3 rounded-lg bg-white"
                    value={emergency.emergencyType}
                    onChange={(e) => handleChange(e, "emergencyType")}
                >
                    <option value="" disabled>
                        Select an emergency type
                    </option>
                    {[
                        "Heart Attack",
                        "Stroke",
                        "Severe Allergic Reaction (Anaphylaxis)",
                        "Choking",
                        "Unconsciousness",
                        "Severe Bleeding",
                        "Respiratory Distress",
                        "Trauma",
                        "Heat Stroke",
                        "Seizures",
                    ].map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mt-5">
                Patients Details
            </h1>
            {emergency.patients.map((patient, index) => (
                <div
                    key={index}
                    className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 mt-5 border border-gray-200 relative"
                >
                    <h2 className="text-lg font-semibold text-blue-600">
                        Patient {index + 1}
                    </h2>
                    <input
                        className="border border-gray-300 p-3 rounded-lg"
                        type="text"
                        placeholder="Patient Name"
                        value={patient.name}
                        onChange={(e) => handleChange(e, "name", index)}
                    />
                    <input
                        className="border border-gray-300 p-3 rounded-lg"
                        type="number"
                        placeholder="Age"
                        value={patient.age}
                        onChange={(e) => handleChange(e, "age", index)}
                    />
                    <select
                        className="border border-gray-300 p-3 rounded-lg bg-white"
                        value={patient.emergencyType}
                        onChange={(e) =>
                            handleChange(e, "emergencyType", index)
                        }
                    >
                        <option value="" disabled>
                            Select an emergency type
                        </option>
                        {[
                            "Heart Attack",
                            "Stroke",
                            "Severe Allergic Reaction (Anaphylaxis)",
                            "Choking",
                            "Unconsciousness",
                            "Severe Bleeding",
                            "Respiratory Distress",
                            "Trauma",
                            "Heat Stroke",
                            "Seizures",
                        ].map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <textarea
                        className="border border-gray-300 p-3 rounded-lg h-24"
                        placeholder="Details"
                        value={patient.details}
                        onChange={(e) => handleChange(e, "details", index)}
                    ></textarea>
                    {emergency.patients.length > 1 && (
                        <button
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-medium p-2 rounded-lg"
                            onClick={() => removePatient(index)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            {error && <div className="text-primary">Error: {error} </div>}
            <button
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg"
                onClick={addPatient}
            >
                + Add Patient
            </button>
            <button
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
}
