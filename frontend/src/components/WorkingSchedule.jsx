import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="schedule-container">
          <div className="schedule-header">
              <h2>Working Schedule</h2>
              <button className="create-btn" onClick={() => navigate("/create-schedule")}>
                  Create New Schedule
              </button>
          </div>
  
          {/* Separate schedules into two tables */}
          {["Day", "Night"].map((shiftType) => {
              const filteredSchedules = schedules.filter(schedule => schedule.shift.toLowerCase() === shiftType.toLowerCase());
  
              return (
                  <div key={shiftType} className="schedule-section">
                      <h2>{shiftType} Shift</h2>
                      <table className="schedule-table">
                          <thead>
                              <tr>
                                  <th>Date</th>
                                  <th>location</th>
                                  <th>vehicle</th>
                                  <th>driver</th>
                                  <th>paramedic</th>
                                  <th>Actions</th>
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
                                          <td>
                                              <button className="edit-btn" onClick={() => navigate(`/edit-schedule/${schedule.id}`)}>
                                                  Edit
                                              </button>
                                              <button className="delete-btn" onClick={() => handleDeleteSchedule(schedule.id)}>
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                              ) : (
                                  <tr>
                                      <td colSpan="6" style={{ textAlign: "center" }}>No {shiftType.toLowerCase()} shift schedules available</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              );
          })}
      </div>
  );
  
  
};

export default WorkingSchedule;
