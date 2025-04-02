<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import "../css/resources.css";
import { useAuthContext } from "../hooks/useAuthContext";

function Medicalresources() {
    const { user } = useAuthContext();
    const [resources, setResources] = useState(null);

    // Fetch existing schedules
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch("api/resources/resourse", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                setResources(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        };
        fetchResources();
    }, [user.token]); // Adding user.token as a dependency

    return (
        <div className="ra-container">
            <div className="ra-content">
                <main className="ra-main">
                    {/* Title row n edt btn*/}
                    <div className="ra-header-row">
                        <h1><center>Medical Recourse Allocation</center></h1>
                        <button className="ra-add-btn">Add</button>
                    </div>

                    {/* Table*/}
                    <table className="ra-table">
                        <thead>
                            <tr>
                                <th>Medical Id</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Allocated Amount</th>
                                <th>Remaining Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources && resources.length > 0 ? (
                                resources.map((resource) => (
                                    <tr key={resource.medID}>
                                      <td>{resource.medID}</td>
                                        <td>{resource.medName}</td>
                                        <td>{resource.quantity}</td>
                                        <td>{resource.allocatedAmount}</td>
                                        <td>{resource.remainingAmount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No resources available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="ra-footer-row">
                        <button className="ra-edit-btn">Edit</button>
                        <button className="ra-edit-btn">
                            Generate report
                        </button>
                    </div>
=======
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/resources.css";
import { useAuthContext } from "../hooks/useAuthContext";

const AddNewResource = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({
        medId: "",
        medName: "",
        quantity: "",
    });

    // Fetch existing resources (replace with your API endpoint)
    useEffect(() => {
        fetch("/api/resources/resourse", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setResources(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            // Delete API call
            fetch(`/api/resources/resourse/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            })
                .then(() =>
                    setResources(resources.filter((item) => item.id !== id))
                )
                .catch((error) => console.error("Error:", error));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add new resource API call
        fetch("/api/resources/resourse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(newResource),
        })
            .then((response) => response.json())
            .then((data) => {
                setResources([...resources, data]);
                setNewResource({ medId: "", medName: "", quantity: "" });
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div className="ra-container">
            <div className="ra-content">
                <main className="ra-main">
                    <div className="ra-header-row">
                        <h1>Add New Resource</h1>
                    </div>

                    {/* Add New Resource Form */}
                    <form onSubmit={handleSubmit} className="ra-form">
                    <div className="ra-form-group">
                            <label>Medicine Id:</label>
                            <input
                                type="text"
                                value={newResource.medId}
                                onChange={(e) =>
                                    setNewResource({
                                        ...newResource,
                                        medId: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="ra-form-group">
                            <label>Medicine Name:</label>
                            <input
                                type="text"
                                value={newResource.medName}
                                onChange={(e) =>
                                    setNewResource({
                                        ...newResource,
                                        medName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="ra-form-group">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                value={newResource.quantity}
                                onChange={(e) =>
                                    setNewResource({
                                        ...newResource,
                                        quantity: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <button type="submit" className="ra-add-btn">
                            Add Resource
                        </button>
                    </form>

                    {/* Resources Table */}
                    <table className="ra-table">
                        <thead>
                            <tr>
                                <th>MedId</th>
                                <th>MedName</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.medId}</td>
                                    <td>{item.medName}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <button
                                            className="ra-action-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/resource-allocation/${item.id}`
                                                )
                                            }
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="ra-action-btn delete"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
>>>>>>> 5042ed577dfdfd951ab55948d953db2c2d7912d5
                </main>
            </div>
        </div>
    );
<<<<<<< HEAD
}

export default Medicalresources;
=======
};

export default AddNewResource;
>>>>>>> 5042ed577dfdfd951ab55948d953db2c2d7912d5
