import { useVehicleContext } from "../hooks/useVehicleContext";

const VehicleOngoingEmergency = () => {
    const { currentEmergency } = useVehicleContext();

    return (
        <div className="relative flex w-full h-full bg-white z-10 rounded-xl shadow-lg border border-gray-200">
            {/* left side */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl text-left font-medium">
                        Ongoing Emergency
                    </h1>
                    {/* emergency type */}
                    <div className="flex items-center gap-3  mt-5">
                        <div className="w-3 h-3 aspect-square bg-red-500 rounded-full animate-ping"></div>
                        <div className="text-lg">
                            {currentEmergency.emergencyType}
                        </div>
                    </div>
                    {/* no of patients */}
                    <div className="flex justify-between items-center mt-10">
                        <p className="text-xl">No of patients: </p>
                        <div className="text-xl py-1 px-8 bg-secondary-200 rounded-xl">
                            {currentEmergency.patients.length}
                        </div>
                    </div>
                    {/* details */}
                    <div className="mt-10">
                        <p className="text-xl"> Address </p>
                        <div className="bg-secondary w-full h-fit">
                            {currentEmergency.details}
                        </div>
                    </div>
                </div>

                {/* accept or reject */}
                <div className="flex flex-col justify-between gap-5">
                    <button className="p-4 cursor-pointer bg-secondary-green rounded-2xl">Patient Picked up</button>
                    <button className="p-4 cursor-pointer bg-red-500 rounded-2xl">Reject</button>
                </div>
            </div>
            {/* right side */}
            <div className="flex-2 bg-secondary rounded-xl"></div>
        </div>
    );
};

export default VehicleOngoingEmergency;
