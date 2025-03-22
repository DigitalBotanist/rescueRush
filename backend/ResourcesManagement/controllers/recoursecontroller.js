import mongoose from "mongoose"
import Resource from '../../shared/models/Resourse.js'

// get all 
export const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({}).sort({ createdAt: -1 }); 
        res.status(200).json(resources); // Status 200 for GET
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get single
export const getResourceBiID = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get new
export const createResource = async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();
        res.status(201).json(resource);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//dlete

export const deleteResource = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid resource ID' });
    }
    try {
        const resource = await Resource.findOneAndDelete({ _id: id });
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json({ msg: 'Resource deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//update


export const updateResource = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid resource ID' });
    }
    try {
        const resource = await Resource.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

