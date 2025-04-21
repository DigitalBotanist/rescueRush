import { useEffect, useState } from "react";

import { useAuthContext } from "../hooks/useAuthContext";
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext";
import { Link } from "react-router-dom";

const HosptaDetails_form = () => {
    const { details, dispatch } = useHospitalDetailsContext();
    const {user} = useAuthContext()

    const [location_lat, setlocation_lat] = useState("");
    const [location_long, setlocation_long] = useState("");
    const [name, setName] = useState("");
    const [city, setcity] = useState("");
    const [Bed, setBeds] = useState("");
    const [ICU, setICU] = useState("");
    const [Emergency_Unit, setEmergency_Unit] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!details) return;
        setlocation_lat(details.location.lat);
        setlocation_long(details.location.long);
        setName(details.name);
        setcity(details.city);
        setBeds(details.Bed);
        setEmergency_Unit(details.Emergency_Unit);
        setICU(details.ICU);
    }, [details]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('user', user)
        if (!user) {
            setError("You must be logged in");
            return;
        }


        const detail = {
            location: {
                lat: location_lat,
                long: location_long,
            },
            name,
            city,
            Bed,
            ICU,
            Emergency_Unit,
        };

        const response = await fetch("/api/hospital", {
            method: "PATCH",
            body: JSON.stringify(detail),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {
            setError(null);
            console.log("New details added", json);
            dispatch({ type: "CREATE_DETAILS", payload: json });
        }
    };

    return (
        <form
            className="bg-white flex flex-col w-1/4 rounded-2xl m-auto p-5"
            onSubmit={handleSubmit}
        >
            <h3 className="text-2xl my-5">Update Hospital Details</h3>

            <label>Location (lat) : </label>
            <input
                type="float"
                onChange={(e) => setlocation_lat(e.target.value)}
                value={location_lat}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            />

            <label>Location (long) : </label>
            <input
                type="float"
                onChange={(e) => setlocation_long(e.target.value)}
                value={location_long}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            />
            <label>Name : </label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            />

            <label>City : </label>
            <input
                type="text"
                onChange={(e) => setcity(e.target.value)}
                value={city}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            />

            <label>Beds : </label>
            <input
                type="number"
                onChange={(e) => setBeds(e.target.value)}
                value={Bed}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            />

            <label>ICU : </label>
            <input
                type="boolean"
                onChange={(e) => setICU(e.target.value)}
                value={ICU}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            />

            <label>Emergency Unit : </label>
            <input
                type="boolean"
                onChange={(e) => setEmergency_Unit(e.target.value)}
                value={Emergency_Unit}
                className="border border-gray-300 rounded-lg p-3 mb-3"
            />

            <Link to="/hospital">
                <button
                    className="bg-primary-400 p-5 rounded-lg cursor-pointer"
                    type="submit"
                >
                    Save
                </button>
            </Link>
        </form>
        
    );
};

export default HosptaDetails_form;
