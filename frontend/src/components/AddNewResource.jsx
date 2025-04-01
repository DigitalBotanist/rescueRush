import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Resourses.css";

const AddNewResource = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    medId: "",
    medName: "",
    quantity: ""
  });

  // Fetch existing resources (replace with your API endpoint)
  useEffect(() => {
    fetch('http://localhost:4000/api/resources')
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      // Delete API call
      fetch(`http://localhost:4000/api/resources/${id}`, { method: 'DELETE' })
        .then(() => setResources(resources.filter(item => item.id !== id)))
        .catch(error => console.error('Error:', error));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new resource API call
    fetch('http://localhost:4000/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResource)
    })
    .then(response => response.json())
    .then(data => {
      setResources([...resources, data]);
      setNewResource({ medId: "", medName: "", quantity: "" });
    })
    .catch(error => console.error('Error:', error));
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
              <label>Medical ID:</label>
              <input
                type="text"
                value={newResource.medId}
                onChange={(e) => setNewResource({...newResource, medId: e.target.value})}
                required
              />
            </div>
            
            <div className="ra-form-group">
              <label>Medicine Name:</label>
              <input
                type="text"
                value={newResource.medName}
                onChange={(e) => setNewResource({...newResource, medName: e.target.value})}
                required
              />
            </div>

            <div className="ra-form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={newResource.quantity}
                onChange={(e) => setNewResource({...newResource, quantity: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="ra-add-btn">Add Resource</button>
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
                <tr key={item.id}>
                  <td>{item.medId}</td>
                  <td>{item.medName}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      className="ra-action-btn"
                      onClick={() => navigate(`/resource-allocation/${item.id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="ra-action-btn delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default AddNewResource;