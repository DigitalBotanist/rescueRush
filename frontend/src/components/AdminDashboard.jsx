import { useState } from "react";
import AdminCreateUser from "./AdminCreateUser";
import AdminUserDetails from "./AdminUserDetails";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("users"); // state to keep track of the active tab

    return (
        <div className="h-full w-full box-border p-2">
            <div className="flex  h-full w-full box-border border border-gray-200 shadow-2lg rounded-2xl">
                {/* menu */}
                <div className="flex-1 flex flex-col h-full">
                    {/* users */}
                    <button
                        className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${
                            activeTab === "users" && "bg-primary-100"
                        }`}
                        onClick={() => {
                            setActiveTab("users");
                        }}
                    >
                        Users
                    </button>
                    
                    {/* create users */}
                    <button
                        className={`p-5 hover:bg-secondary-200 m-2 rounded-2xl text-xl ${
                            activeTab === "create_user" && "bg-primary-100"
                        }`}
                        onClick={() => {
                            setActiveTab("create_user");
                        }}
                    >
                        Create User
                    </button>
                </div>

                {/* content */}
                <div className="flex-4 bg-secondary rounded-2xl inset-shadow-sm inset-shadow-gray-300">
                    {activeTab === "create_user" && <AdminCreateUser />}
                    {activeTab === "users" && <AdminUserDetails />}
                    {activeTab === "settings" && <div> other</div>}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard