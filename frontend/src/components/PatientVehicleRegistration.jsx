import { useEffect, useState } from "react";
import { useVehicleRegistration } from "../hooks/useVehicleRegistration";
import { usePatientContext } from "../hooks/usePatientContext";
import { usePatientVehicleRegistration } from "../hooks/usePatientVehicleRegistration";

const PatientVehicleRegistration = () => {
    const { vin, dispatch } = usePatientContext();
    const { registration, isLoading, error } = usePatientVehicleRegistration()
    const [currentVin, setCurrentVin] = useState("")

    useEffect(() => {
    if (vin) {
        setCurrentVin(vin)
    }

    }, [vin])

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        await registration(currentVin) 

        if (error) {
            return 
        }
    }

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-4xl">Registration</h1>
            <div className="grow flex justify-center items-center">
                <div className="flex flex-col">
                {vin ? (
                    <span className="text-right text-secondary-green-700">
                        Registered
                    </span>
                ) : (
                    <span className="text-right text-primary-700">
                        Not registered
                    </span>
                )}
                    <form className="w-80" onSubmit={handleOnSubmit}>
                        <label className="ml-1" htmlFor="vin">
                            VIN
                        </label>
                        <input
                            className="w-full h-10 p-3 bg-white border-1 border-secondary-400 rounded-lg focus:outline-none focus:border-2 focus:border-secondary-500 "
                            type="text"
                            name="vin"
                            id="vin"
                            onChange={(e) => {setCurrentVin(e.target.value)}}
                            value={currentVin}
                        />
                        <button
                            className="mt-2 cursor-pointer bg-primary-500 p-3 rounded-lg w-full text-white"
                            type="submit"
                        >
                            Register
                        </button>
                        {error && <div className="text-red-500">Error:{error}</div>}
                    </form>
                </div>

            </div>
        </div>
    );
};

export default PatientVehicleRegistration;
