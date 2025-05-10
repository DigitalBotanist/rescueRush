import { useState } from "react";
import CallOpNewEmergencyForm from "./CallOpNewEmergencyForm";
import { useCallopContext } from "../hooks/useCallopContext";
import VoiceCall from "./VoiceCall";
import VehicleVoiceCall from "./VehicleVoiceCall";
import CallopVoiceCall from "./CallopVoiceCall";

const CallOpDashboard = () => {
    const [activeTab, setActiveTab] = useState("new_emergency"); // state to keep track of the active tab
    const {connectedVehicleId, isConnected, socket} = useCallopContext()

    const [isOpen, setIsOpen] = useState(false)
    const handleCloseOpen = () => {}
    
    return (
        <div className="h-full w-full box-border p-2">
            {/* {<VoiceCall handleCloseOpen={handleCloseOpen} socket={socket} isOpen={isOpen} receiverId={connectedVehicleId} type="callop" /> } */}
            <CallopVoiceCall />
            <div className="flex  h-full w-full box-border border border-gray-200 shadow-2lg rounded-2xl">
                {/* menu */}
                <div className="flex-1 flex flex-col h-full">
                    {/* connection status */}
                    {isConnected ? (
                        <div className="w-fit bg-secondary-green rounded-2xl p-2 flex justify-center items-center h-10">
                            CONNECTED
                        </div>
                    ) : (
                        <div className="w-fit bg-primary-500 rounded-2xl p-2 flex justify-center items-center h-10">
                            NOT CONNECTED
                        </div>
                    )}
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
