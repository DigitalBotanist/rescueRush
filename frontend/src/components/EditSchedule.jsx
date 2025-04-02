import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/resources.css'; // Reuse the same CSS

const EditSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({
    shift: '',
    date: '',
    branches: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/schedules/${id}`);
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        setSchedule(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [id]);

  // Handle form updates
  const handleChange = (field, value) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  // Handle branch updates
  const handleBranchChange = (index, field, value) => {
    const updatedBranches = [...schedule.branches];
    updatedBranches[index][field] = value;
    setSchedule(prev => ({ ...prev, branches: updatedBranches }));
  };

  // Update schedule
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule)
      });
      
      if (response.ok) {
        navigate('/working-schedule');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="schedule-container">
      <h2>Edit Schedule</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="shift-selection">
          <select 
            value={schedule.shift}
            onChange={(e) => handleChange('shift', e.target.value)}
          >
            <option>Day Shift (5:00 - 17:00)</option>
            <option>Night Shift (17:00 - 5:00)</option>
          </select>
          
          <input
            type="date"
            value={schedule.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        {schedule.branches.map((branch, index) => (
          <div key={index} className="branch-inputs">
            <input
              placeholder="Branch Name"
              value={branch.name}
              onChange={(e) => handleBranchChange(index, 'name', e.target.value)}
            />
            <input
              placeholder="Position"
              value={branch.position}
              onChange={(e) => handleBranchChange(index, 'position', e.target.value)}
            />
            <input
              placeholder="Emp No"
              value={branch.empNo}
              onChange={(e) => handleBranchChange(index, 'empNo', e.target.value)}
            />
            <input
              placeholder="Amb Reg No"
              value={branch.ambRegNo}
              onChange={(e) => handleBranchChange(index, 'ambRegNo', e.target.value)}
            />
            <input
              placeholder="Phone"
              value={branch.phone}
              onChange={(e) => handleBranchChange(index, 'phone', e.target.value)}
            />
          </div>
        ))}

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/working-schedule')}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Update Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSchedule;