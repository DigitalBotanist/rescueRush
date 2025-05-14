import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import UserImage from "./UserImage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminUserDetails = () => {
    const { user } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const roles = [
        "admin",
        "driver",
        "paramedic",
        "callop",
        "manager",
        "maintainer",
        "hospital_staff",
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [user.token]);

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/admin/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleProfileImageChange = async (e, userId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            const response = await fetch(`/api/admin/user/${userId}/upload-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const updatedUser = await response.json();
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, profileImage: updatedUser.profileImage } : user
                )
            );
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("User Details", 14, 15);

        const tableColumn = ["First Name", "Last Name", "Email", "Role"];
        const tableRows = [];

        users.forEach((user) => {
            const userData = [
                user.firstName,
                user.lastName,
                user.email,
                user.role,
            ];
            tableRows.push(userData);
        });

autoTable(doc, {
  head: [tableColumn],
  body: tableRows,
  startY: 20,
});

        doc.save("user-details.pdf");
    };

    return (
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">User Details</h2>

            <button
                onClick={generatePDF}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
                Generate PDF
            </button>

            <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">First Name</th>
                        <th className="px-6 py-3 text-left">Last Name</th>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Profile Image</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-100">
                            <td className="px-6 py-4">{user.firstName}</td>
                            <td className="px-6 py-4">{user.lastName}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                                <select
                                    value={selectedRole || user.role}
                                    onChange={handleRoleChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 flex items-center space-x-4">
                                {user.profileImage ? (
                                    <div className="h-20">
                                        <UserImage user_img={user.profileImage} rounded={true} />
                                    </div>
                                ) : (
                                    <span className="text-gray-500">No Image</span>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleProfileImageChange(e, user._id)}
                                    className="file:py-2 file:px-4 file:bg-blue-100 file:text-blue-700 file:rounded-lg cursor-pointer"
                                />
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button
                                    onClick={() => deleteUser(user._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserDetails;
