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
                    method: "POST", //newly added
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify(newSchedule),   //newly added
                });

                if (response.ok) {
                    const createdSchedule = await response.json();    //newly added
                    setSchedules([...schedules, createdSchedule]);        //newly added
                    setSelectedDate(""); // Reset date after creation   newly added
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

    const handleShiftChange = (newShift) => {
    setSelectedShift(newShift);
    };

    const updateSchedule = (id) => {
        // Placeholder for update logic; replace with actual implementation
        console.log(`Update schedule with ID: ${id}`);
        // Example: navigate to an edit page or open a modal
    };


    return (
        <div className="ra-container">
            <div className="ra-container">
                <main className="ra-main">
                    <div className="ra-header-row">
                        <h1><center>Working Schedule</center></h1>
                        <button
                            onClick={handleCreateNewSchedule}
                            className="schedule-create-btn"
                        >
                            Create New Schedule
                        </button>

                        {/*<Link to="create-schedule" className="schedule-create-btn">Create New Schedule</Link> old one*/ }
                    </div>

                    {/* Inputs for date and shift selection newly added */}
                    <div className="schedule-controls">
                        <label>
                            Date:
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Shift:
                            <select
                                value={selectedShift}
                                onChange={(e) => handleShiftChange(e.target.value)}
                            >
                                <option value="Day Shift">Day Shift</option>
                                <option value="Night Shift">Night Shift</option>
                            </select>
                        </label>
                        <button onClick={handleAddBranch}>Add Branch</button>
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
                                    onClick={() => updateSchedule(schedules._id)}
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
