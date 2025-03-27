import schedule from '../models/scheduleModel.js';
import mongoose from 'mongoose';

// get all 
export const getSchedule = async (req, res) => {
    try {
        const schedule = await schedule.find({}).sort({ createdAt: -1 }); 
        res.status(200).json(schedule); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get single
export const getScheduleBiID = async (req, res) => {
    const { id } = req.params;
    try {
        const schedule = await schedule.findById(id);
        if (!schedule) {
            return res.status(404).json({ error: 'schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//create new
export const createSchedule = async (req, res) => {
    try {
        const schedule = new schedule(req.body);
        await schedule.save();
        res.status(201).json(schedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteSchedulefull = async (req, res) => {
    const { date, shift } = req.body; // Getting date and shift from request body
    
    // Basic validation
    if (!date || !shift) {
        return res.status(400).json({ error: 'Date and shift are required' });
    }

    try {
        // Find and delete schedule with matching date and shift
        const schedule = await schedule.findOneAndDelete({ 
            date: new Date(date), 
            shift 
        });
        
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found for given date and shift' });
        }
        
        res.status(200).json({ msg: 'Schedule deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteSchedule = async (req, res) => {
    const { id } = req.params; // Getting schedule ID from URL parameters
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid schedule ID' });
    }

    try {
        const schedule = await schedule.findByIdAndDelete(id);
        
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        
        res.status(200).json({ 
            msg: 'Schedule deleted successfully',
            deletedSchedule: schedule 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//update
export const updateSchedule = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid schedule ID' });
    }
    try {
        const schedule = await schedule.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );
        if (!schedule) {
            return res.status(404).json({ error: 'schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


