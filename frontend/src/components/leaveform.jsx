import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/leave.css";

const LeaveTables = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [tablesData, setTablesData] = useState({
        'Standard Time Off': [],
        'Sick Leave': [],
        'Holiday': []
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [editingData, setEditingData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/leave-data", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setTablesData(data);
            } catch (error) {
                console.error("Error fetching leave data:", error);
                alert("Failed to load leave data. Please try again.");
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleAddRow = (tableName) => {
        const newRow = {
            tempId: Date.now(),
            name: "",
            date: new Date().toISOString().split('T')[0],
            duration: "1",
            isNew: true
        };
        setTablesData(prev => ({
            ...prev,
            [tableName]: [...prev[tableName], newRow]
        }));
        setEditingRow(newRow.tempId);
        setEditingData({ ...newRow });
    };

    const handleSaveRow = async (tableName, row) => {
        try {
            const userDoc = await fetch(`/api/users/${user.id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const userData = await userDoc.json();
            const email = userData.email;

            let updatedRow;
            if (row.isNew) {
                const { tempId, isNew, ...dataToSend } = editingData;
                const response = await fetch(`/api/leave-data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ ...dataToSend, type: tableName, email })
                });
                if (!response.ok) throw new Error("Failed to save new entry");
                updatedRow = await response.json();
                setTablesData(prev => ({
                    ...prev,
                    [tableName]: prev[tableName].map(r =>
                        r.tempId === row.tempId ? { ...updatedRow, tempId: row.tempId } : r
                    )
                }));
            } else {
                const response = await fetch(`/api/leave-data/${row._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ ...editingData, type: tableName, email })
                });
                if (!response.ok) throw new Error("Failed to update entry");
                updatedRow = await response.json();
                setTablesData(prev => ({
                    ...prev,
                    [tableName]: prev[tableName].map(r =>
                        r._id === row._id ? updatedRow : r
                    )
                }));
            }
            setEditingRow(null);
            setEditingData(null);
        } catch (error) {
            console.error("Error saving row:", error);
            alert("Failed to save changes. Please try again.");
        }
    };

    const handleDelete = async (tableName, row) => {
        if (window.confirm("Delete this entry?")) {
            try {
                if (row.isNew) {
                    setTablesData(prev => ({
                        ...prev,
                        [tableName]: prev[tableName].filter(r => r.tempId !== row.tempId)
                    }));
                } else {
                    const response = await fetch(`/api/leave-data/${row._id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (!response.ok) throw new Error("Failed to delete entry");
                    setTablesData(prev => ({
                        ...prev,
                        [tableName]: prev[tableName].filter(r => r._id !== row._id)
                    }));
                }
            } catch (error) {
                console.error("Error deleting row:", error);
                alert("Failed to delete entry. Please try again.");
            }
        }
    };

    const handleStatusChange = async (tableName, row, newStatus) => {
        try {
            const response = await fetch(`/api/leave-data/${row._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ ...row, status: newStatus })
            });
            if (!response.ok) throw new Error("Failed to update status");
            const updatedRow = await response.json();
            setTablesData(prev => ({
                ...prev,
                [tableName]: prev[tableName].map(r =>
                    r._id === row._id ? updatedRow : r
                )
            }));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please try again.");
        }
    };

    const filteredData = (tableName, data) => {
        return data.filter(item => {
            const matchesSearch = selectedFilters.some(filter => {
                const value = String(item[filter]).toLowerCase();
                return value.includes(searchTerm.toLowerCase());
            });
            return selectedFilters.length === 0 || matchesSearch;
        });
    };

    return (
        <div className="ra-container">
            <header className="ra-header">
                <button 
                    className="request-button"
                    onClick={() => navigate('/requests')}
                >
                    Request
                </button>
                
                <div className="search-filter-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && setSearchTerm('')}
                    />
                    
                    <select
                        className="filter-dropdown"
                        multiple
                        value={selectedFilters}
                        onChange={(e) => setSelectedFilters([...e.target.selectedOptions].map(o => o.value))}
                    >
                        <option value="name">Name</option>
                        <option value="date">Date</option>
                        <option value="duration">Duration</option>
                    </select>
                </div>
            </header>

            {Object.entries(tablesData).map(([tableName, data]) => (
                <div key={tableName} className="table-container">
                    <div className="table-header">
                        <button 
                            className="add-row-button"
                            onClick={() => handleAddRow(tableName)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddRow(tableName)}
                        >
                            +
                        </button>
                        <h3>{tableName}</h3>
                        <button
                            className="delete-table-btn"
                            onClick={() => {
                                if (window.confirm(`Delete all ${tableName} data?`)) {
                                    setTablesData(prev => ({ ...prev, [tableName]: [] }));
                                }
                            }}
                        >
                            Delete Table
                        </button>
                    </div>

                    <table className="ra-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Duration</th>
                                {user.role === 'resource_manager' && <th>Status</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData(tableName, data).map(row => {
                                const rowKey = row._id || row.tempId;
                                return (
                                    <tr key={rowKey}>
                                        {editingRow === rowKey ? (
                                            <>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={editingData.name}
                                                        onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="date"
                                                        value={editingData.date}
                                                        onChange={(e) => setEditingData(prev => ({ ...prev, date: e.target.value }))}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={editingData.duration}
                                                        onChange={(e) => setEditingData(prev => ({ ...prev, duration: e.target.value }))}
                                                        min="1"
                                                    />
                                                </td>
                                                {user.role === 'resource_manager' && (
                                                    <td>
                                                        <select
                                                            value={editingData.status || 'pending'}
                                                            onChange={(e) => setEditingData(prev => ({ ...prev, status: e.target.value }))}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </td>
                                                )}
                                                <td>
                                                    <button onClick={() => handleSaveRow(tableName, row)}>
                                                        Save
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{row.name}</td>
                                                <td>{row.date}</td>
                                                <td>{row.duration}</td>
                                                {user.role === 'resource_manager' && (
                                                    <td>
                                                        {row.status || 'pending'}
                                                        <select
                                                            onChange={(e) => handleStatusChange(tableName, row, e.target.value)}
                                                        >
                                                            <option value="">Change Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </td>
                                                )}
                                                <td>
                                                    <div className="action-dropdown">
                                                        <button className="dropdown-toggle">⋮</button>
                                                        <div className="dropdown-content">
                                                            <button onClick={() => {
                                                                setEditingRow(rowKey);
                                                                setEditingData({ ...row });
                                                            }}>
                                                                Edit
                                                            </button>
                                                            <button onClick={() => handleDelete(tableName, row)}>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default LeaveTables;