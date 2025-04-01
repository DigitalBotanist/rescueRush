import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkingSchedule.css';

const WorkingSchedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [selectedShift, setSelectedShift] = useState('Day Shift');
  const [selectedDate, setSelectedDate] = useState('');
  const [branches, setBranches] = useState([{ 
    name: '', position: '', empNo: '', ambRegNo: '', phone: '' 
  }]);

  // Fetch existing schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/api/schedules');
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };
    fetchSchedules();
  }, []);

  const handleCreateNewSchedule = async () => {
    if (window.confirm('Create new schedule?')) {
      const newSchedule = {
        shift: selectedShift,
        date: selectedDate,
        branches
      };
      
      try {
        const response = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSchedule)
        });
        
        if (response.ok) {
          navigate('/working-schedule');
        }
      } catch (error) {
        console.error('Error creating schedule:', error);
      }
    }
  };

  const handleAddBranch = () => {
    setBranches([...branches, { 
      name: '', position: '', empNo: '', ambRegNo: '', phone: '' 
    }]);
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Delete entire schedule?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  return (
    <div className="schedule-container">
        
      <div className="schedule-header">
        <h2>Working Schedule</h2>
        <button 
          className="create-btn"
          onClick={() => navigate('/create-schedule')}
        >
          Create New Schedule
        </button>
      </div>

      {/* Existing Schedules */}
      {schedules.map((schedule) => (
        <div key={schedule.id} className="schedule-card">
          <div className="schedule-header">
            <h3>{schedule.shift}</h3>
            <div className="schedule-actions">
              <button 
                className="edit-btn"
                onClick={() => navigate(`/edit-schedule/${schedule.id}`)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteSchedule(schedule.id)}
              >
                Delete
              </button>

              <button 
                className="create-btn"
                onClick={() => navigate('/create-schedule')}
              >
                Create New Schedule
              </button>
            </div>
          </div>
          
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Position</th>
                <th>Emp No</th>
                <th>Amb Reg No</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {schedule.branches.map((branch, index) => (
                <tr key={index}>
                  <td>{branch.name}</td>
                  <td>{branch.position}</td>
                  <td>{branch.empNo}</td>
                  <td>{branch.ambRegNo}</td>
                  <td>{branch.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

    </div>
  );
};

export default WorkingSchedule;