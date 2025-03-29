import { useVehicleContext } from "../hooks/useVehicleContext";
import MapWithRouting from "./MapWithRouting";

const VehicleOngoingEmergency = () => {
    const { socket, currentEmergency, dispatch } = useVehicleContext();

    const handleReject = () => {
        socket.emit("reject_request", currentEmergency._id);
    };
    return (
        <div className="relative flex w-full h-full bg-white z-10 rounded-xl shadow-lg border border-gray-200">
            {/* left side */}
            <div className="w-1/4 h-16/20 flex-1 p-5 flex flex-col justify-between absolute z-10 bg-white/75 mt-20 left-5 rounded-2xl shadow-2xl ">
                <div>
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
                    </div>
                    {/* routes options */}
                    <div className="my-3">
                        <h1 className="text-2xl">Routes</h1>
                        <div className="flex w-full justify-between">
                            <div className="cursor-pointer bg-primary-100 p-4 px-10 rounded-lg shadow text-lg">
                                route 1
                            </div>
                            <div className="cursor-pointer bg-white p-4 px-10 rounded-lg border border-gray-200">
                                route 1
                            </div>
                            <div className="cursor-pointer bg-white p-4 px-10 rounded-lg shadow">
                                route 1
                            </div>
                        </div>
                    </div>
                    {/* contact options */}
                    <div className="my-3 flex flex-col gap-5">
                        <h1 className="text-2xl">Contacts</h1>
                        <button className="bg-secondary-200 p-4 w-full rounded-2xl shadow text-2xl cursor-pointer">
                            Contact Dispatcher
                        </button>
                        <button className="bg-secondary-200 p-4 w-full rounded-2xl shadow text-2xl cursor-pointer">
                            Contact Emergency caller
                        </button>
                    </div>
                </div>
                {/* accept or reject */}
                <div className="flex flex-col justify-between gap-5 my-3">
                    <button className="p-4 cursor-pointer bg-secondary-green rounded-2xl">
                        Patient Picked up
                    </button>
                    <button
                        className="p-4 cursor-pointer bg-red-500 rounded-2xl"
                        onClick={handleReject}
                    >
                        Reject
                    </button>
                </div>
            </div>
            {/* right side */}
            <div className="flex-2 bg-secondary rounded-xl z-0">
                {<MapWithRouting />}
            </div>
        </div>
    );
};

export default VehicleOngoingEmergency;
