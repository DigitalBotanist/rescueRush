import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/leave.css";
import { useAuthContext } from "../hooks/useAuthContext";


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/resources/leave/all-requests", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const data = await response.json();
                setTablesData(data);
            } catch (error) {
                console.error("Error fetching leave data:", error);
            }
        };
        if(user) fetchData();
    }, [user]);

    const handleAddRow = (tableName) => {
        const newRow = {
            id: Date.now(),
            name: "",
            date: new Date().toISOString().split('T')[0],
            duration: "1",
            isNew: true
        };
        
        setTablesData(prev => ({
            ...prev,
            [tableName]: [...prev[tableName], newRow]
        }));
        setEditingRow(newRow.id);
    };

    const handleSaveRow = (tableName, rowId) => {
        setTablesData(prev => ({
            ...prev,
            [tableName]: prev[tableName].map(row => 
                row.id === rowId ? { ...row, isNew: false } : row
            )
        }));
        setEditingRow(null);
    };

    const handleDelete = (tableName, rowId) => {
        if (window.confirm("Delete this entry?")) {
            setTablesData(prev => ({
                ...prev,
                [tableName]: prev[tableName].filter(row => row.id !== rowId)
            }));
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData(tableName, data).map(row => (
                                <tr key={row.id}>
                                    <td contentEditable={editingRow === row.id}>
                                        {row.name}
                                    </td>
                                    <td contentEditable={editingRow === row.id}>
                                        {row.date}
                                    </td>
                                    <td contentEditable={editingRow === row.id}>
                                        {row.duration}
                                    </td>
                                    <td>
                                        <div className="action-dropdown">
                                            {editingRow === row.id ? (
                                                <button
                                                    className="save-btn"
                                                    onClick={() => handleSaveRow(tableName, row.id)}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <>
                                                    <button className="dropdown-toggle">⋮</button>
                                                    <div className="dropdown-content">
                                                        <button onClick={() => setEditingRow(row.id)}>
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(tableName, row.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default LeaveTables;