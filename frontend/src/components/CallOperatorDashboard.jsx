// frontend/src/components/CallOperatorDashboard.js
import React, { useState } from 'react';
import '../App.css'; // Import App.css instead of CallOperatorDashboard.css
import axios from 'axios';

const CallOperatorDashboard = () => {
  const [formData, setFormData] = useState({
    callerName: '',
    callerPhoneNumber: '',
    location: '',
    patientName: '',
    emergencyType: '',
    age: '',
    patientDetails: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/emergency-calls', formData);
      alert('Emergency call recorded successfully!');
      setFormData({
        callerName: '',
        callerPhoneNumber: '',
        location: '',
        patientName: '',
        emergencyType: '',
        age: '',
        patientDetails: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error recording emergency call');
    }
  };

  return (
    <div className="dashboard-container">
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
          <li className="active">Call Operator Recording</li>
          <li>Update Emergency</li>
        </ul>
      </div>
      <div className="main-content">
        <h2>Call Operator Recording</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Caller Name:</label>
            <input
              type="text"
              name="callerName"
              value={formData.callerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Caller Phone Number:</label>
            <input
              type="text"
              name="callerPhoneNumber"
              value={formData.callerPhoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Patient Name:</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Emergency Type:</label>
            <select
              name="emergencyType"
              value={formData.emergencyType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Medical">Medical</option>
              <option value="Accident">Accident</option>
              <option value="Fire">Fire</option>
            </select>
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Patient Details:</label>
            <textarea
              name="patientDetails"
              value={formData.patientDetails}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="button" className="add-another">Add Another</button>
            <button type="submit" className="submit">Submit</button>
          </div>
        </form>
      </div>
      <div className="sidebar-right">
        <img src="/images/caduceus.png" alt="Caduceus" className="caduceus" />
      </div>
    </div>
  );
};

export default CallOperatorDashboard;