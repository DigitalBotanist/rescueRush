import { useCallopContext } from "../hooks/useCallopContext";
import CallOpOngoingEmergencyMap from "./CallOpOngoingEmergencyMap";
import { useState } from "react";

const CallOpOngoingEmergency = () => {
    const { currentEmergency } = useCallopContext();
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    return (
        <div className="h-full">
            {currentEmergency ? (
                <div className="h-full w-full flex ">
                    <div className="grow">
                        <CallOpOngoingEmergencyMap />
                    </div>
                    <div className="w-1/2 p-5 bg-white/50 m-3 rounded-2xl flex flex-col gap-5 overflow-auto">
                        <h1 className="text-3xl text-center mb-5">
                            Ongoing Emergency
                        </h1>
                        <div className="bg-white p-4 w-full rounded-2xl border border-gray-300">
                            <h5 className="mb-3">Contact Emergency caller</h5>
                            <h4 className="text-xl">
                                {currentEmergency.caller.name}
                            </h4>
                            <h4 className="text-xl">
                                {currentEmergency.caller.number}
                            </h4>
                        </div>
                        <div className="bg-white p-4 w-full rounded-2xl border border-gray-300">
                            <h5 className="mb-3">Patients</h5>
                            <div className="flex flex-col gap-5">
                                {currentEmergency.patients.map((patient) => (
                                    <div
                                        key={patient._id}
                                        className="border border-gray-200 rounded-xl p-4 shadow-sm"
                                    >
                                        <div
                                            className="flex justify-between items-center cursor-pointer "
                                            onClick={() =>
                                                toggleExpand(patient._id)
                                            }
                                        >
                                            <div className="flex gap-10">
                                                <div className="flex flex-col">
                                                    <p className="font-medium">
                                                        {patient.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Age: {patient.age}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span>Ambulance: </span>
                                                    {patient.vehicle ? (
                                                        <div className="rounded-2xl px-2 py-2 text-green-500">
                                                            assigned
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-2xl px-2 py-2 text-primary-500">
                                                            not assigned
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {expanded[patient._id] ? (
                                                <img
                                                    className="w-5 aspect-square"
                                                    src="/assets/up_arrow.png"
                                                />
                                            ) : (
                                                <img
                                                    className="w-5 aspect-square"
                                                    src="/assets/down_arrow.png"
                                                />
                                            )}
                                        </div>
                                        {expanded[patient._id] && (
                                            <div>
                                                <div className="bg-white w-full border-t border-gray-300 my-3 py-3">
                                                    <h5 className="mt-5 mb-3">
                                                        Ambulance
                                                    </h5>
                                                    {patient.vehicle ? (
                                                        <div className="flex">
                                                            <div className="grow">
                                                                <h4 className="text">
                                                                    <span className="font-light">
                                                                        VIN:{" "}
                                                                    </span>
                                                                    {
                                                                        patient
                                                                            .vehicle
                                                                            .vin
                                                                    }
                                                                </h4>
                                                                <h4 className="">
                                                                    <span className="font-light">
                                                                        Driver
                                                                        Name:{" "}
                                                                    </span>
                                                                    {
                                                                        patient
                                                                        .vehicle
                                                                            .driver
                                                                            .firstName
                                                                    }{" "}
                                                                    {
                                                                        patient
                                                                        .vehicle
                                                                            .driver
                                                                            .lastName
                                                                    }
                                                                </h4>
                                                            </div>
                                                            <div>
                                                                <button className="bg-yellow-400 rounded-2xl px-5 py-3">
                                                                    Contact
                                                                    Ambulance
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            Not assigned yet{" "}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="bg-white w-full border-t border-gray-300 my-3 py-3">
                                                    <h5 className=" mb-3">
                                                        details
                                                    </h5>
                                                    <div className="flex">
                                                        <div className="grow">
                                                            <h4 className="text">
                                                                <span className="font-light">
                                                                    details:
                                                                </span>
                                                                {"  " +
                                                                    patient.details}
                                                            </h4>
                                                            <h4 className="">
                                                                <span className="font-light">
                                                                    Hospital:
                                                                </span>
                                                                {patient.hospital
                                                                    ? patient.hospital
                                                                    : "Not assigned yet"}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center w-full h-full">
                    <h1 className="text-2xl font-semibold">
                        There is no ongoing emergency
                    </h1>
                </div>
            )}
        </div>
    );
};

export default CallOpOngoingEmergency;
