import mongoose from "mongoose"
import user from '../../shared/models/userModel.js'

// get all 
export const getUsers = async (req, res) => {
    try {
        const resources = await user.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
        res.status(200).json(resources); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get single
export const getUserByID = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await user.findById(id);
        if (!resource) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get new
export const createNewUser = async (req, res) => {
        const {first, last, email, password, role} = req.body
        console.log(first)
        try {
            const newUser = await user.createNew(first, last, email, password, role) 
    
            res.status(200).json({msg: "new account is created", newUser})
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    
};

//dlete

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const resource = await user.findOneAndDelete({ _id: id });
        if (!resource) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//update


export const updateUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const resource = await user.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );
        if (!resource) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

