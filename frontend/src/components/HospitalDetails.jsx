import { Link } from "react-router-dom";
import { useHospitalDetailsContext } from "../hooks/useHospitalDetailContext";

const HospitalDetails = ({}) => {
    const { details, dispatch } = useHospitalDetailsContext();

    const handleClick = async () => {
        const response = await fetch("api/hospital/" + details._id, {
            method: "DELETE",
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: "DELETE_DETAILS", payload: json });
        }
    };

    if (details) {
        console.log(details);
    }

    return (
        <div className="flex bg-white justify-between p-5 rounded-2xl">
            {details ? (
                <>
                    <div>
                        <p>
                            <strong>Location :</strong>
                            {details.location &&
                                `${details.location.lat} ${details.location.long}`}
                        </p>
                        <p>
                            <strong>Name :</strong>
                            {details.name}
                        </p>
                        <p>
                            <strong>Bed :</strong>
                            {details.Bed}
                        </p>
                        <p>
                            <strong>ICU :</strong>
                            {details.ICU}
                        </p>
                        <p>
                            <strong>Emergency_Unit :</strong>
                            {details.Emergency_Unit ? "true" : "false"}
                        </p>
                    </div>

                    <div className="h-10 flex gap-2 self-end ">
                        <Link to="/hospital/hospital_details_form">
                            <button className="hospitalDashboard-container-hospital-details-cotent-button-deisgn">
                                Update
                            </button>
                        </Link>
                    </div>
                </>
            ) : (
                <div> No hospital details found </div>
            )}
        </div>
    );
};
export default HospitalDetails;
