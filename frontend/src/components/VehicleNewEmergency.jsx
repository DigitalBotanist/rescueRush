import { useVehicleContext } from "../hooks/useVehicleContext";

// component to show when a new emergency request arrives 
const VehicleNewEmergency = () => {
    const { newEmergency, socket, dispatch } = useVehicleContext();

    // handle accept button click
    const handleAccept = async() => {
        if (socket) {
            socket.emit('accept_request', newEmergency._id)
        }
    }

    // handle reject button click
    const handleReject = async() => {
        if (socket) {
            socket.emit('reject_request', newEmergency._id)
        }
    }


    return (
        <div className="absolute h-screen w-screen z-20 flex items-center justify-center">
            {/* Dark overlay */}
            <div className="absolute h-screen w-screen bg-black opacity-20 z-0"></div>

            {/* Centered white div */}
            <div className="relative flex w-4/5 h-9/10 bg-white z-10 rounded-xl shadow-lg">
                {/* left side */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl text-center mt-5 font-medium">
                            Emergency alert
                        </h1>
                        {/* emergency type */}
                        <div className="flex items-center gap-3 justify-end mt-5">
                            <div className="w-3 h-3 aspect-square bg-red-500 rounded-full animate-ping"></div>
                            <div className="text-lg">
                                {newEmergency.emergencyType}
                            </div>
                        </div>
                        {/* no of patients */}
                        <div className="flex justify-between items-center mt-10">
                            <p className="text-xl">No of patients: </p>
                            <div className="text-xl py-1 px-8 bg-secondary-200 rounded-xl">
                                {newEmergency.patients.length}
                            </div>
                        </div>
                        {/* details */}
                        <div className="mt-10">
                            <p className="text-xl">Details </p>
                            <div className="bg-secondary w-full h-fit">
                                {newEmergency.details}
                            </div>
                        </div>
                    </div>

                    {/* accept or reject */}
                    <div className="flex justify-between gap-5">
                        <button className="p-2 flex-1 rounded-2xl cursor-pointer bg-secondary-green" onClick={handleAccept}>
                            accept
                        </button>
                        <button className="p-2 flex-1 rounded-2xl cursor-pointer bg-red-500" onClick={handleReject}>
                            reject
                        </button>
                    </div>
                </div>
                {/* right side */}
                <div className="flex-2 bg-secondary rounded-xl"></div>
            </div>
        </div>
    );
};

export default VehicleNewEmergency;
