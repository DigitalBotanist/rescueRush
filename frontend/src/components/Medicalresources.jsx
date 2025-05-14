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

  const handleGenerateReport = async () => {
  try {
    const reportDate = '2025-05-14'; // Replace with your dynamic date if needed

    const response = await fetch(`/api/resources/report?date=${encodeURIComponent(reportDate)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.pdf'; // Change filename/extension if needed
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading the report:', error);
  }
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
                        <button className="ra-edit-btn" onClick={handleGenerateReport}>Generate report</button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Medicalresources;