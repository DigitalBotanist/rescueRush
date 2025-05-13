import React, { useEffect, useState } from "react";
import "../css/resources.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

function StaffDetails() {
    const { user } = useAuthContext();
    const [resources, setResources] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch("/api/resources/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                setResources(data);
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        };
        if (user) {
            fetchResources();
        }
    }, [user]);

    // Handle Delete
    const handleDelete = async (id) => {
        if (
            window.confirm("Are you sure you want to delete this staff member?")
        ) {
            try {
                const response = await fetch(`/api/resources/user/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.ok) {
                    setResources(
                        resources.filter((resource) => resource._id !== id)
                    );
                    setSuccessMessage("Successfully deleted the staff member.");
                    setTimeout(() => setSuccessMessage(""), 3000);
                } else {
                    console.error("Failed to delete staff member");
                }
            } catch (error) {
                console.error("Error deleting staff:", error);
            }
        }
    };

    // Handle Edit Click
    const handleEditClick = (staff) => {
        setEditingStaff(staff._id);
        setFormData({
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email,
            role: staff.role,
        });
    };

    // Handle Input Change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Save
    const handleSave = async (id) => {
        try {
            const response = await fetch(`/api/resources/user/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedStaff = await response.json(); // Get updated staff data

                setResources((prevResources) =>
                    prevResources.map((staff) =>
                        staff._id === id ? updatedStaff : staff
                    )
                );

                setEditingStaff(null); // Exit edit mode
                setSuccessMessage("Staff details updated successfully.");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                console.error("Failed to update staff details.");
            }
        } catch (error) {
            console.error("Error updating staff:", error);
        }
    };

    return (
        <div className="ra-container">
            <div className="ra-content">
                <main className="ra-main">
                    <div className="ra-header-row">
                        <h1>
                            <center>Staff Details</center>
                        </h1>
                        <Link to="/resources/add_staff" className="ra-add-btn">
                            Add
                        </Link>
                    </div>

                    {successMessage && (
                        <div
                            className="success-message"
                            style={{
                                color: "green",
                                textAlign: "center",
                                margin: "10px 0",
                            }}
                        >
                            {successMessage}
                        </div>
                    )}

                    <table className="ra-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources && resources.length > 0 ? (
                                resources.map((resource) => (
                                    <tr key={resource._id}>
                                        {editingStaff === resource._id ? (
                                            <>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={
                                                            formData.firstName
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={
                                                            formData.lastName
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        name="role"
                                                        value={formData.role}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    >
                                                        <option value="admin">
                                                            Admin
                                                        </option>
                                                        <option value="driver">
                                                            Driver
                                                        </option>
                                                        <option value="paramedic">
                                                            Paramedic
                                                        </option>
                                                        <option value="callop">
                                                            Call Operator
                                                        </option>
                                                        <option value="manager">
                                                            Resource Manager
                                                        </option>
                                                        <option value="maintainer">
                                                            Maintainer
                                                        </option>
                                                        <option value="hospital_staff">
                                                            Hospital Staff
                                                        </option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button
                                                        className="ra-save-btn"
                                                        onClick={() =>
                                                            handleSave(
                                                                resource._id
                                                            )
                                                        }
                                                        style={{
                                                            fontSize: "12px",
                                                            padding: "5px 10px",
                                                            marginRight: "5px",
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="ra-cancel-btn"
                                                        onClick={() =>
                                                            setEditingStaff(
                                                                null
                                                            )
                                                        }
                                                        style={{
                                                            fontSize: "12px",
                                                            padding: "5px 10px",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{resource.firstName}</td>
                                                <td>{resource.lastName}</td>
                                                <td>{resource.email}</td>
                                                <td>{resource.role}</td>
                                                <td>
                                                    <button
                                                        className="ra-edit-btn"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                resource
                                                            )
                                                        }
                                                        style={{
                                                            marginRight: "10px",
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="ra-dlt-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                resource._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">
                                        No Staff member available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
}

export default StaffDetails;
