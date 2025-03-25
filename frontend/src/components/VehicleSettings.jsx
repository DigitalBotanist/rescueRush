import { useState } from "react";
import VehicleRegistration from "./VehicleRegistration";

const VehicleSettings = () => {
    const [activeTab, setActiveTab] = useState("registration");

    let content; // store the content of selected tab

    // update content depending on the activeTab
    if (activeTab === "registration") {
        content = <VehicleRegistration />;
    } else if (activeTab === "details") {
        content = <div>details</div>;
    }

    return (
        <div className="h-full box-border flex justify-center items-center bg-gradient-to-r from-secondary-50 via to-secondary-400">
            <div className="bg-white h-3/4 w-1/2 rounded-2xl flex justify-between box-border p-1">
                {/* left */}
                <div className="flex flex-col items-center w-1/3">
                    {/* logo */}
                    <img
                        className="mt-5"
                        src="/assets/rescueRushLogoOnly.svg"
                        alt="logo"
                    />

                    {/* tab buttons */}
                    <button
                        className={`w-full p-3 rounded-lg ${
                            activeTab === "registration"
                                ? "bg-secondary-200"
                                : ""
                        }`}
                        key={"registration"}
                        onClick={() => setActiveTab("registration")}
                    >
                        Registration
                    </button>

                    {/* tab buttons */}
                    <button
                        className={`w-full p-3 rounded-lg ${
                            activeTab === "details" ? "bg-secondary-200" : ""
                        }`}
                        key={"details"}
                        onClick={() => setActiveTab("details")}
                    >
                        Details
                    </button>
                </div>
                {/* right */}
                <div className="p-5 bg-secondary-200 w-2/3 box-border m-2 rounded-2xl">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default VehicleSettings;
