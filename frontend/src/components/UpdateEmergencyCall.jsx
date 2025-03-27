// frontend/src/components/UpdateEmergencyCall.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import App.css instead of UpdateEmergencyCall.css

const UpdateEmergencyCall = () => {
  const [emergencyCalls, setEmergencyCalls] = useState([]);
  const [updateData, setUpdateData] = useState({
    vehicleAssigned: '',
    currentDetails: ''
  });
  const [selectedCallId, setSelectedCallId] = useState(null);

  useEffect(() => {
    fetchEmergencyCalls();
  }, []);

  const fetchEmergencyCalls = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emergency-calls');
      setEmergencyCalls(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/emergency-calls/${id}`, updateData);
      fetchEmergencyCalls();
      setUpdateData({ vehicleAssigned: '', currentDetails: '' });
      setSelectedCallId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/emergency-calls/${id}`);
      fetchEmergencyCalls();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="update-container">
      <div className="header">
        <img src="/images/logo.png" alt="Rescue Rush Logo" className="logo" />
        <div className="user-profile">
          <img src="/images/user.jpg" alt="User" className="user-img" />
          <span>John Connor</span>
        </div>
      </div>
      <div className="sidebar">
        <ul>
          <li>Home</li>
          <li>Call Operator Recording</li>
          <li className="active">Update Emergency</li>
        </ul>
      </div>
      <div className="main-content">
        <h2>Update Emergency Calls</h2>
        {emergencyCalls.map((call) => (
          <div key={call._id} className="call-card">
            <p><strong>Emergency ID:</strong> {call._id}</p>
            <p><strong>Caller Number:</strong> {call.callerPhoneNumber}</p>
            <p><strong>Patient Name:</strong> {call.patientName}</p>
            <p><strong>Vehicle Assigned:</strong> {call.vehicleAssigned || 'Not Assigned'}</p>
            <p><strong>Current Details:</strong> {call.currentDetails || 'No Details'}</p>
            {selectedCallId === call._id ? (
              <div className="update-form">
                <div className="form-group">
                  <label>Vehicle Assigned:</label>
                  <input
                    type="text"
                    name="vehicleAssigned"
                    value={updateData.vehicleAssigned}
                    onChange={handleUpdateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Current Details:</label>
                  <textarea
                    name="currentDetails"
                    value={updateData.currentDetails}
                    onChange={handleUpdateChange}
                  />
                </div>
                <button onClick={() => handleUpdate(call._id)} className="update-btn">Update</button>
              </div>
            ) : (
              <div className="card-buttons">
                <button onClick={() => handleDelete(call._id)} className="delete-btn">Delete</button>
                <button
                  onClick={() => setSelectedCallId(call._id)}
                  className="update-btn"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdateEmergencyCall;