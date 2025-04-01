import { useState } from "react";
import WorkingSchedule from "./WorkingSchedule";
import Medicalresources from "./Medicalresources";

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState("home"); // state to keep track of the active tab

    return (
        <div className="h-full w-full box-border p-2">
            <div className="flex  h-full w-full box-border border border-gray-200 shadow-2lg rounded-2xl">
                {/* menu */}
                <div className="flex-1 flex flex-col h-full">
                    {/* home tab button */}
                    <button
                        className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${
                            activeTab === "home" && "bg-primary-100"
                        }`}
                        onClick={() => {
                            setActiveTab("home");
                        }}
                    >
                        Home
                    </button>
                    {/* settings tab button */}
                    <button
                        className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${
                            activeTab === "working_schedule" && "bg-primary-100"
                        }`}
                        onClick={() => {
                            setActiveTab("working_schedule");
                        }}
                    >
                        Working Schedule
                    </button>
                    <button
                        className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${
                            activeTab === "resources" && "bg-primary-100"
                        }`}
                        onClick={() => {
                            setActiveTab("resources");
                        }}
                    >
                        Medical Resources
                    </button>
                </div>

                {/* content */}
                <div className="flex-4 bg-secondary rounded-2xl inset-shadow-sm inset-shadow-gray-300">
                    {activeTab === "home" && <div> home</div>}
                    {activeTab === "working_schedule" && <WorkingSchedule />}
                    {activeTab === "resources" && <Medicalresources />}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
