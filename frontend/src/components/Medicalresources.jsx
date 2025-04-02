import React, { useEffect, useState } from "react";
import "../css/resources.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

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
                        <Link to='add_resources' className="ra-add-btn">Add</Link>
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
                                    <tr key={resource._id}>
                                      <td>{resource.medId}</td>
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
                </main>
            </div>
        </div>
    );
}

export default Medicalresources;
