import { useEffect, useState } from "react";
import { useVehicleContext } from "../hooks/useVehicleContext";
import { useVehicleRegistration } from "../hooks/useVehicleRegistration";

const VehicleRegistration = () => {
    const { vin, dispatch } = useVehicleContext();
    const { registration, isLoading, error } = useVehicleRegistration();
    const [currentVin, setCurrentVin] = useState("");

    // if the vin changes update the currentVin
    useEffect(() => {
        if (vin) {
            setCurrentVin(vin);
        }
    }, [vin]);

    // handle registration button click
    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // register the vin
        await registration(currentVin);

        // todo: what is this for ??
        if (error) {
            return;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-4xl">Registration</h1>
            <div className="grow flex justify-center items-center">
                <div className="flex flex-col">
                    {/* show registered or not */}
                    {vin ? (
                        <span className="text-right text-secondary-green-700">
                            Registered
                        </span>
                    ) : (
                        <span className="text-right text-primary-700">
                            Not registered
                        </span>
                    )}

                    {/* register form */}
                    <form className="w-80" onSubmit={handleOnSubmit}>
                        <label className="ml-1" htmlFor="vin">
                            VIN
                        </label>
                        <input
                            className="w-full h-10 p-3 bg-white border-1 border-secondary-400 rounded-lg focus:outline-none focus:border-2 focus:border-secondary-500 "
                            type="text"
                            name="vin"
                            id="vin"
                            onChange={(e) => {
                                setCurrentVin(e.target.value);
                            }}
                            value={currentVin}
                        />

                        {/* register button */}
                        <button
                            className="mt-2 cursor-pointer bg-primary-500 p-3 rounded-lg w-full text-white"
                            type="submit"
                        >
                            Register
                        </button>

                        {/* show errors if there are when registering */}
                        {error && (
                            <div className="text-red-500">Error:{error}</div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VehicleRegistration;
