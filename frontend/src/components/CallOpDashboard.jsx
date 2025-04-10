import { useState } from "react";
import CallOpNewEmergencyForm from "./CallOpNewEmergencyForm";

const CallOpDashboard = () => {
    const [activeTab, setActiveTab] = useState("new_emergency"); // state to keep track of the active tab

    return (
        <div className="h-full w-full box-border p-2">
            <div className="flex  h-full w-full box-border border border-gray-200 shadow-2lg rounded-2xl">
                {/* menu */}
                <div className="flex-1 flex flex-col h-full">
                    {/* new_emergency tab button */}
                    <button
                        className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${
                            activeTab === "new_emergency" && "bg-primary-100"
                        }`}
                        onClick={() => {
                            setActiveTab("new_emergency");
                        }}
                    >
                        New Emergency
                    </button>
                    {/* settings tab button */}
                    <button
                        className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${
                            activeTab === "settings" && "bg-primary-100"
                        }`}
                        onClick={() => {
                            setActiveTab("settings");
                        }}
                    >
                        Settings
                    </button>
                </div>

                {/* content */}
                <div className="flex-4 bg-secondary rounded-2xl inset-shadow-sm inset-shadow-gray-300">
                    {activeTab === "new_emergency" && (
                        <div className="h-full w-full flex justify-center items-center">
                            <CallOpNewEmergencyForm />
                        </div>
                    )}
                    {activeTab === "settings" && <div> other</div>}
                </div>
            </div>
        </div>
    );
};

export default CallOpDashboard;
