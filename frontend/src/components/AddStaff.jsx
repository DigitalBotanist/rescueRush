import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/resources.css";
import { useAuthContext } from '../hooks/useAuthContext';

const AddStaff = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [newUsers, setNewUsers] = useState({
        first: "",
        last: "",
        email: "",
        role: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/resources/user', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(newUsers),
        })
            .then(response => response.json())
            .then(data => {
                // Reset form
                setNewUsers({ first: "", last: "", email: "", role: "", password: "" });
                // Navigate to StaffDetails or another desired page
                navigate('/resources');
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">First Name:</label>
                    <input
                        type="text"
                        value={newUsers.first}
                        onChange={(e) => setNewUsers({ ...newUsers, first: e.target.value })}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Last Name:</label>
                    <input
                        type="text"
                        value={newUsers.last}
                        onChange={(e) => setNewUsers({ ...newUsers, last: e.target.value })}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="email"
                        value={newUsers.email}
                        onChange={(e) => setNewUsers({ ...newUsers, email: e.target.value })}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password:</label>
                    <input
                        type="password"
                        value={newUsers.password}
                        onChange={(e) => setNewUsers({ ...newUsers, password: e.target.value })}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Role:</label>
                    <select
                        value={newUsers.role}
                        onChange={(e) => setNewUsers({ ...newUsers, role: e.target.value })}
                        required
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="driver">Driver</option>
                        <option value="paramedic">Paramedic</option>
                        <option value="callop">Call Operator</option>
                        <option value="manager">Resource Manager</option>
                        <option value="maintainer">Maintainer</option>
                        <option value="hospital_staff">Hospital Staff</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 rounded-md"
                        onClick={() => navigate('/working-schedule')}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="ra-edit-btn">
                        Save Member
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStaff;
