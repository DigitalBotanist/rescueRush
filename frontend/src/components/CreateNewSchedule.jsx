import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNewSchedule = () => {
    const navigate = useNavigate();
    const [selectedShift, setSelectedShift] = useState('Day Shift (5:00 - 17:00)');
    const [selectedDate, setSelectedDate] = useState('');
    const [branches, setBranches] = useState([{ 
      name: '', Role: '', empNo: '', VIN: '', phone: '' 
    }]);
  
    const handleAddBranch = () => {
      setBranches([...branches, { 
        name: '', Role: '', empNo: '', VIN: '', phone: '' 
      }]);
    };
  
    const handleCreateSchedule = async () => {
      // Add your API POST logic here
      navigate('/working-schedule');
    };
  
    return (
      
      <div className="create-schedule">
        <div className="shift-selection">
          <select 
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option>Day Shift (5:00 - 17:00)</option>
            <option>Night Shift (17:00 - 5:00)</option>
          </select>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {branches.map((branch, index) => (
          <div key={index} className="branch-inputs">
            <input
              placeholder="Branch Name"
              value={branch.name}
              onChange={(e) => {
                const newBranches = [...branches];
                newBranches[index].name = e.target.value;
                setBranches(newBranches);
              }}
            />
            {/* Repeat for other fields */}
          </div>
        ))}

        <button className="add-branch" onClick={handleAddBranch}>
          + Add Branch
        </button>

        <div className="form-actions">
          <button className="cancel-btn">Cancel</button>
          <button className="save-btn" onClick={handleCreateSchedule}>
            Save Schedule
          </button>
        </div>
      </div>
    );
  };
  
  export default CreateNewSchedule;