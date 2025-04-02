import React, { useEffect, useState } from "react";
import "../css/resources.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Medicalresources() {
    const { user } = useAuthContext();
    const [resources, setResources] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch("/api/resources/resourse", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setResources(data);
            } catch (error) {
                console.error("Error fetching resources:", error);
            }
        };
        if (user?.token) {
            fetchResources();
        }
    }, [user?.token]);

    //  navigation to AddNewResource page
    const handleAddClick = () => {
        navigate("/add-new-resource"); 
    };

    const handleGenerateReport = () => {
        if (!resources || resources.length === 0) {
            alert("No resources available to generate a report.");
            return;
        }

    const headers = ["Medical ID,Name,Quantity,Allocated Amount,Remaining Amount"];

    const rows = resources.map(resource => 
        `${resource.medID},${resource.medName},${resource.quantity},${resource.allocatedAmount},${resource.remainingAmount}`
    );

    const csvContent = headers.concat(rows).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `medical_resources_report_${new Date().toISOString().split('T')[0]}.csv`); // Filename with date
        
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="ra-container">
            <div className="ra-content">
                <main className="ra-main">
                    <div className="ra-header-row">
                        <h1><center>Medical Recourse Allocation</center></h1>
                        <Link to='add_resources' className="ra-add-btn">Add</Link>
                    </div>

                    {/* Table */}
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
                                    <td colSpan="5">No resources available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="ra-footer-row">
                        <button className="ra-edit-btn">Edit</button>
                        <button className="ra-edit-btn">Generate report</button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Medicalresources;