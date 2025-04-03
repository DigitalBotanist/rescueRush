import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const CreateNewSchedule = () => {
  const {user} = useAuthContext()
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShift, setSelectedShift] = useState('day');
    const [selectedLocation, setSelectedLocation] = useState('kandy');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedParamedic, setSelectedParamedic] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [paramedics, setParamedics] = useState([]);

    useEffect(() => {
        fetch('/api/resources/drivers', {
          headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${user.token}`
        }
        })
            .then(res => res.json())
            .then(data => setDrivers(data.users));

            fetch('/api/resources/vehicles', {
              headers : {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${user.token}`
            }
            })
                .then(res => res.json())
                .then(data => setVehicles(data.vehicles));
            
        fetch('/api/resources/paramedics', {
          headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${user.token}`
        }
        })
            .then(res => res.json())
            .then(data => setParamedics(data.users));
    }, []);

    /*const handleCreateSchedule = async () => {
        const scheduleData = {
            date: selectedDate,
            shift: selectedShift,
            location: selectedLocation,
            vin: selectedVehicle, //|| null
            driver: selectedDriver,
            paramedic: selectedParamedic
        };
        
        console.log('Schedule Created:', scheduleData);
        fetch('/api/resources/schedule', {
          method: "POST",
          body: JSON.stringify(scheduleData), 
          headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${user.token}`
        }
        })
            .then(res => res.json())
        navigate('/working-schedule');
    };*/

    const handleCreateSchedule = async () => {
        const scheduleData = {
            date: selectedDate,
            shift: selectedShift,
            location: selectedLocation,
            vin: selectedVehicle,
            driver: selectedDriver,
            paramedic: selectedParamedic
        };
        
        console.log('Creating Schedule:', scheduleData);
    
        try {
            const response = await fetch('/api/resources/schedule', {
                method: "POST",
                body: JSON.stringify(scheduleData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error creating schedule:", errorData);
                return;
            }
    
            const newSchedule = await response.json();
            console.log("Schedule Created Successfully:", newSchedule);
    
            navigate('/working-schedule'); 
        } catch (error) {
            console.error("Error creating schedule:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-center text-xl font-semibold mb-4">Create New Schedule</h2>

            <div className="mb-4">
                <label className="block text-gray-700">Date:</label>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    required 
                    className="w-full p-2 border rounded-md"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Shift:</label>
                <select 
                    value={selectedShift} 
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="day">Day Shift (5:00 - 17:00)</option>
                    <option value="night">Night Shift (17:00 - 5:00)</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Location:</label>
                <select 
                    value={selectedLocation} 
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="kandy">Kandy</option>
                    <option value="galle">Galle</option>
                    <option value="trinco">Trincomalee</option>
                    <option value="matara">Matara</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Vehicle (Optional):</label>
                <select 
                    value={selectedVehicle} 
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">Select Vehicle</option>
                    {vehicles.map(vehicle => (
                        <option key={vehicle._id} value={vehicle._id}>{vehicle.vin}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Driver:</label>
                <select 
                    value={selectedDriver} 
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    required 
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">Select Driver</option>
                    {drivers.map(driver => (
                        <option key={driver._id} value={driver._id}>{driver.firstName} {driver.lastName}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Paramedic:</label>
                <select 
                    value={selectedParamedic} 
                    onChange={(e) => setSelectedParamedic(e.target.value)}
                    required 
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">Select Paramedic</option>
                    {paramedics.map(paramedic => (
                        <option key={paramedic._id} value={paramedic._id}>{paramedic.firstName} {paramedic.lastName}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-between">
                <button 
                    className="px-4 py-2 bg-[#cb2222] text-white rounded-md" 
                    onClick={() => navigate('/working-schedule')}
                >
                    Cancel
                </button>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md" 
                    onClick={handleCreateSchedule}
                >
                    Save Schedule
                </button>
            </div>
        </div>
    );
};

export default CreateNewSchedule;
