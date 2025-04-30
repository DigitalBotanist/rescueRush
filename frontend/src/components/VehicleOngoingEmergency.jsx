import { useEffect, useState } from "react";
import { useVehicleContext } from "../hooks/useVehicleContext";
import MapWithRouting from "./MapWithRouting";
import OngoingEmergencyMap from "./OngoingEmergencyMap";

const VehicleOngoingEmergency = () => {
    const {
        socket,
        currentEmergency,
        patient,
        dispatch,
        location,
        hospital,
        status,
    } = useVehicleContext();

    const patientLocation = {
        lng: currentEmergency.location.coordinates[0],
        lat: currentEmergency.location.coordinates[1],
    };

    const [routeIndex, setRouteIndex] = useState(0);
    const [noOfRoutes, setNoOfRoutes] = useState(0);
    const [isDone, setIsDone] = useState(false);
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

    // handle when patient is droped off to the hospital
    const handleDrop = () => {
        socket.emit("patient_dropoff", {
            emergencyId: currentEmergency._id,
            patientId: patient._id,
        }); // send message to the server

        setIsDone(true); // update state

        // if server doesn't repond within 5 seconds, change the button back to clickable
        setTimeout(() => {
            setIsDone(false);
        }, 5000);
    };

    // handle done button click
    const handleDone = () => {
        dispatch({
            type: "UNSET_CURRENT_EMERGENCY",
        });
        dispatch({
            type: "UNSET_PATIENT",
        });
        dispatch({
            type: "SET_STATUS",
            payload: { status: null },
        });
    };

    // change the route
    const changeRoute = (routeNo) => {
        setRouteIndex(routeNo - 1);
    };

    // hospital state changes
    useEffect(() => {
        console.log(patient);
        if (patient.status === "onway") {
            console.log(hospital.location);
            setDestinationLocation({
                lng: hospital.location.long,
                lat: hospital.location.lat,
            });
        }
    }, [hospital]);

    return (
        <div className="relative flex w-full h-full bg-white z-10 rounded-xl shadow-lg border border-gray-200">
            {status === "done" && (
                <div className="absolute h-full w-full z-30 flex items-center justify-center">
                    <div className="absolute h-full w-full bg-black opacity-20 z-0"></div>

                    <div className="p-5 relative flex flex-col w-1/4 h-6/10 bg-white z-10 rounded-xl shadow-lg justify-between items-center">
                        <h3 className="p-4 bg-gray-200 rounded-2xl text-center text-xl text-gray-700 w-full">
                            Notification
                        </h3>
                        <div className="w-full flex flex-col items-center">
                            <img
                                src="/assets/fireworks.png"
                                className="w-1/2 aspect-auto "
                                alt=""
                            />
                            <h1 className="text-3xl text-center font-bold text-blue-950">
                                Patient successfull arrived at the hospital{" "}
                            </h1>
                        </div>
                        <button
                            className="p-4 cursor-pointer bg-secondary-green rounded-2xl w-[80%]"
                            onClick={handleDone}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
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
                    {/* hospital details */}
                    {(patient.status === "onway" ||
                        patient.status === "done") &&
                        hospital && (
                            <div className="mt-3 bg-white p-4 w-full rounded-2xl border border-gray-300">
                                <h5 className="mb-3">Hospital details</h5>
                                <h4 className="text-xl">{hospital.name}</h4>
                                <h4 className="text-xl">{hospital.city}</h4>
                            </div>
                        )}
                    {/* routes options */}
                    <div className="my-3">
                        <h1 className="text-2xl">Routes</h1>
                        <div className="flex w-full justify-between gap-5">
                            {Array.from({ length: noOfRoutes }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        onClick={() => changeRoute(index + 1)}
                                        className={`text-center cursor-pointer flex-1 p-4 rounded-lg ${
                                            routeIndex === index
                                                ? "bg-primary-100   shadow text-lg"
                                                : "bg-white border border-gray-200"
                                        }`}
                                    >
                                        route {index + 1}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    {/* contact options */}
                    <div className="my-3 flex flex-col gap-5">
                        <h1 className="text-2xl">Contacts</h1>
                        {(patient.status === "assigned" ||
                            patient.status === "picked") && (
                            <div className="bg-white p-4 w-full rounded-2xl border border-gray-300">
                                <h5 className="mb-3">
                                    Contact Emergency caller
                                </h5>
                                <h4 className="text-xl">
                                    {currentEmergency.caller.name}
                                </h4>
                                <h4 className="text-xl">
                                    {currentEmergency.caller.number}
                                </h4>
                            </div>
                        )}
                        <button className="bg-secondary-200 p-4 w-full rounded-2xl shadow text-2xl cursor-pointer">
                            Contact Dispatcher
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
                            className={`${"p-4 cursor-pointer rounded-2xl"} ${
                                isDone ? "bg-gray-300" : "bg-green-400"
                            }`}
                            onClick={handleDrop}
                            disabled={isDone}
                        >
                            {isDone ? "Loading" : "Arrived at the hospital"}
                        </button>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            {/* right side */}
            <div className="flex-2 bg-secondary rounded-xl z-0">
                <OngoingEmergencyMap
                    destinationPosition={destinationLocation}
                    routeIndex={routeIndex}
                    noOfRoutes={noOfRoutes}
                    setNoOfRoutes={setNoOfRoutes}
                />
            </div>
        </div>
    );
};

export default VehicleOngoingEmergency;
