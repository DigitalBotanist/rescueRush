import mongoose from "mongoose"
import Resource from '../../shared/models/Resourse.js'

// get all 
export const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({}).sort({ createdAt: -1 }); 
        res.status(200).json(resources); 
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

export const  generateReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }

        const selectedDate = new Date(date);
        if (isNaN(selectedDate)) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

        const resources = await Resource.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        const reportData = resources.map(resource => ({
            medID: resource.medID,
            productName: resource.productName,
            brand: resource.brand,
            allocatedAmount: resource.allocatedAmount,
            remainingAmount: resource.remainingAmount,
        }));

        const summary = {
            medID: 'Summary',
            productName: '',
            brand: '',
            allocatedAmount: resources.reduce((sum, r) => sum + r.allocatedAmount, 0) || 0,
            remainingAmount: resources.reduce((sum, r) => sum + r.remainingAmount, 0) || 0,
        };
        reportData.push(summary);

        // Manually create CSV string
        const headers = ['medID', 'productName', 'brand', 'allocatedAmount', 'remainingAmount'];
        let csv = headers.join(',') + '\n';
        reportData.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            });
            csv += values.join(',') + '\n';
        });

        // Set headers for file download
        res.header('Content-Type', 'text/csv');
        res.attachment(`medical_resource_report_${date}.csv`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};