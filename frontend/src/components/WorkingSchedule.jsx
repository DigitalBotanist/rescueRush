import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/resources.css";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkingSchedule = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [selectedShift, setSelectedShift] = useState("Day Shift");
    const [selectedDate, setSelectedDate] = useState("");
    const [branches, setBranches] = useState([
        {
            name: "",
            position: "",
            empNo: "",
            ambRegNo: "",
            phone: "",
        },
    ]);

    // Fetch existing schedules
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await fetch("api/resources/schedule", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                setSchedules(data);
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        };
        fetchSchedules();
    }, []);

    const handleCreateNewSchedule = async () => {
        if (window.confirm("Create new schedule?")) {
            const newSchedule = {
                shift: selectedShift,
                date: selectedDate,
                branches,
            };

            try {
                const response = await fetch("api/resources/schedule", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    navigate("/working-schedule");
                }
            } catch (error) {
                console.error("Error creating schedule:", error);
            }
        }
    };

    const handleAddBranch = () => {
        setBranches([
            ...branches,
            {
                name: "",
                position: "",
                empNo: "",
                ambRegNo: "",
                phone: "",
            },
        ]);
    };

    const handleDeleteSchedule = (id) => {
        if (window.confirm("Delete entire schedule?")) {
            setSchedules(schedules.filter((schedule) => schedule.id !== id));
        }
    };

    return (
        <div className="ra-container">
            <div className="ra-container">
                <main className="ra-main">
                    <div className="ra-header-row">
                        <h1>Working Schedule
                            
                        </h1>
                        <Link to="create-schedule" className="schedule-create-btn">Create New Schedule</Link>
                    </div>

                    {/* Separate schedules into two tables */}
                    {["Day", "Night"].map((shiftType) => {
                        const filteredSchedules = schedules.filter(schedule => schedule.shift.toLowerCase() === shiftType.toLowerCase());

                        return (
                            <div key={shiftType} className="schedule-section">
                                <h2>{shiftType} Shift</h2>
                                <table className="ra-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>location</th>
                                            <th>vehicle</th>
                                            <th>driver</th>
                                            <th>paramedic</th>
                                            <th>VIN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSchedules.length > 0 ? (
                                            filteredSchedules.map((schedule) => (
                                                <tr key={schedule._id}>
                                                    <td>{schedule.date}</td>
                                                    <td>{schedule.location}</td>
                                                    <td>{schedule.vehicle}</td>
                                                    <td>{schedule.driver}</td>
                                                    <td>{schedule.paramedic}</td>
                                                    <td>{schedule.VIN}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">No schedules available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="schedule-footer-row">
                                    <button className="ra-edit-btn">Edit</button>
                                    
                                </div>
                            </div> 
                        );
                    })}
                </main> 
            </div>
        </div>
    );
};

export default WorkingSchedule;
