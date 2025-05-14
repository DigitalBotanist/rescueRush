import { useState } from "react";
import { useVehicleContext } from "../hooks/useVehicleContext";

const ScheduleMaintain = () => {
    const { vin, socket, isConnected, status} = useVehicleContext();
    const [formData, setFormData] = useState({
        maintenanceType: "",
        date: "",
        notes: "",
    });
    const [errors, setErrors] = useState({
        maintenanceType: "",
        date: "",
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = { maintenanceType: "", date: "" };
        let isValid = true;

        if (!formData.maintenanceType) {
            newErrors.maintenanceType = "Please select a maintenance type";
            isValid = false;
        }

        if (!formData.date) {
            newErrors.date = "Please select a date";
            isValid = false;
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date = "Date cannot be in the past";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);
        } // send socket message
        if (socket) {
            socket.emit("schedule_maintainance", {
                formData,
            });
        }
    };

    return (
        <div className="h-full flex justify-center items-center p-6">
            <div className="w-full max-w-2xl space-y-4">
                {/* Header Section */}
                <div className="bg-white rounded-2xl p-8 shadow-xl transform transition-all hover:shadow-2xl">
                    <h1 className="text-4xl font-bold text-gray-800 text-center">
                        Schedule Maintenance
                    </h1>
                </div>

                {/* Vehicle Info Section */}
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Current Vehicle Info
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium">
                                VIN
                            </span>
                            <span className="text-gray-800 font-light">
                                {vin}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium">
                                Status
                            </span>
                            <span
                                className={`font-light text-amber-500`}
                            >
                                {status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Maintenance Form Section */}
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Schedule Maintenance
                    </h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Type of Maintenance */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="maintenanceType"
                                className="text-sm font-medium text-gray-700 mb-2"
                            >
                                Type of Maintenance
                            </label>
                            <select
                                id="maintenanceType"
                                value={formData.maintenanceType}
                                onChange={handleInputChange}
                                className={`border ${
                                    errors.maintenanceType
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-lg px-4 py-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-secondary-green-500 focus:outline-none transition duration-200`}
                                required
                            >
                                <option value="">Select type</option>
                                <option value="oil_change">Oil Change</option>
                                <option value="tire_rotation">
                                    Tire Rotation
                                </option>
                                <option value="brake_inspection">
                                    Brake Inspection
                                </option>
                                <option value="engine_check">
                                    Engine Check
                                </option>
                            </select>
                            {errors.maintenanceType && (
                                <span className="text-red-600 text-sm mt-1">
                                    {errors.maintenanceType}
                                </span>
                            )}
                        </div>

                        {/* Preferred Date */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="date"
                                className="text-sm font-medium text-gray-700 mb-2"
                            >
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className={`border ${
                                    errors.date
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-lg px-4 py-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-secondary-green-500 focus:outline-none transition duration-200`}
                                required
                            />
                            {errors.date && (
                                <span className="text-red-600 text-sm mt-1">
                                    {errors.date}
                                </span>
                            )}
                        </div>

                        {/* Additional Notes */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="notes"
                                className="text-sm font-medium text-gray-700 mb-2"
                            >
                                Additional Notes
                            </label>
                            <textarea
                                id="notes"
                                rows={4}
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-secondary-green-500 focus:outline-none resize-none transition duration-200"
                                placeholder="Describe any specific issues or instructions..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!!errors.maintenanceType || !!errors.date}
                            className={`w-full bg-secondary-green-500 text-white rounded-lg px-4 py-3 font-medium transition duration-200 ${
                                errors.maintenanceType || errors.date
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-secondary-green-600 focus:ring-2 focus:ring-secondary-green-400 focus:outline-none"
                            }`}
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ScheduleMaintain;
