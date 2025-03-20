import { useState } from "react";
import DriverDashboardHome from "./DriverDashboardHome";

const DriverDashboard = () => {
    const [activeTab, setActiveTab] = useState('home')

    return (
        <div className="h-full w-full box-border p-2">
            <div className="flex  h-full w-full box-border border border-gray-200 shadow-2lg rounded-2xl">
                {/* menu */}
                <div className="flex-1 flex flex-col h-full">
                    <button className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${activeTab === 'home' && 'bg-primary-100'}`} onClick={() => {setActiveTab('home')}}>Home</button>
                    <button className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${activeTab === 'settings' && 'bg-primary-100'}`} onClick={() => {setActiveTab('settings')}}>Settings</button>
                </div>

                {/* content */}
                <div className="flex-4 bg-secondary rounded-2xl inset-shadow-sm inset-shadow-gray-300">
                    {activeTab === 'home' && <DriverDashboardHome />}
                    {activeTab === 'settings' && <div> other</div>}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
