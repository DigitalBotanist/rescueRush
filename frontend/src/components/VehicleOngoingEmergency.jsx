import { useEffect, useState } from "react";
import { useVehicleContext } from "../hooks/useVehicleContext";
import MapWithRouting from "./MapWithRouting";
import OngoingEmergencyMap from "./OngoingEmergencyMap";

const VehicleOngoingEmergency = () => {
    const { socket, currentEmergency, patient, dispatch, location, hospital } =
        useVehicleContext();

    const patientLocation = {
        lng: currentEmergency.location.coordinates[0],
        lat: currentEmergency.location.coordinates[1],
    };

    const [destinationLocation, setDestinationLocation] =
        useState(patientLocation);

    const handleReject = () => {
        socket.emit("reject_request", currentEmergency._id);
    };

    const handlePickedUp = () => {
        socket.emit("patient_picked", {
            emergencyId: currentEmergency._id,
            patientId: patient._id,
        });
    };

    const [routeIndex, setRouteIndex] = useState(0)

    const handleDone = () => {
        // socket.emit("")
        console.log("done");
    };

    const changeRoute = (routeNo) => {
        setRouteIndex(routeNo - 1)
    }

    useEffect(() => {
        console.log(patient);
        if (patient.status === "onway") {
            console.log(hospital.location);
            setDestinationLocation({lng: hospital.location.long, lat:hospital.location.lat});
        }
        console.log(destinationLocation);
    }, [hospital]);

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
                        <div className="flex w-full justify-between gap-5">
                            <div onClick={ () => changeRoute(1)} className={`text-center cursor-pointer flex-1 p-4 rounded-lg ${routeIndex === 0 ? "bg-primary-100   shadow text-lg" : "bg-white border border-gray-200" }`}>
                                route 1
                            </div>
                            <div onClick={ () => changeRoute(2)} className={`text-center cursor-pointer flex-1  p-4 rounded-lg ${routeIndex === 1 ? "bg-primary-100   shadow text-lg" : "bg-white border border-gray-200"}`}>
                                route 2
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
                    {patient.status === "assigned" ? (
                        <>
                            <button
                                className="p-4 cursor-pointer bg-secondary-green rounded-2xl"
                                onClick={handlePickedUp}
                            >
                                Patient Picked up
                            </button>
                            <button
                                className="p-4 cursor-pointer bg-red-500 rounded-2xl"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </>
                    ) : patient.status === "picked" ? (
                        <button
                            className="p-4 cursor-pointer bg-gray-400 rounded-2xl"
                            onClick={handleReject}
                        >
                            wating for hospital
                        </button>
                    ) : patient.status === "onway" ? (
                        <button
                            className="p-4 cursor-pointer bg-green-400 rounded-2xl"
                            onClick={handleDone}
                        >
                            Arrived at the hospital
                        </button>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            {/* right side */}
            <div className="flex-2 bg-secondary rounded-xl z-0">
                {/* {patient.status == "onway" ? (
                    <MapWithRouting
                        currentLocation={location}
                        destination={hospital.location}
                    />
                ) : (
                    <MapWithRouting
                        currentLocation={location}
                        destination={destinationLocation}
                    />
                )} */}

                {/* <MapWithRouting
                    currentLocation={location}
                    destination={destinationLocation}
                /> */}

                <OngoingEmergencyMap
                    destinationPosition={destinationLocation}
                    routeIndex={routeIndex}
                />
            </div>
        </div>
    );
};

export default VehicleOngoingEmergency;
