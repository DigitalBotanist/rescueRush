import { Router } from 'express';

import {getResources,getResourceBiID,createResource,deleteResource,updateResource}
 from '../controllers/recoursecontroller.js'; 
const router = Router()

// GET all resources
router.get('/report', getResources);

// GET a single resource by ID
router.get('/:id', getResourceBiID);

// POST a new resource
router.post('/report', createResource);

// PUT to update a resource by ID
router.put('/report/:id', updateResource);

// DELETE a resource by ID
router.delete('/report/:id', deleteResource);

// GET route for generating and downloading a report
/*router.get('/report', async (req, res) => {
    try {
        // Fetch all resources
        const resources = await Resource.find();

        // Prepare the report data
        const reportData = resources.map(resource => ({
            medID: resource.medID,
            productName: resource.productName,
            brand: resource.brand,
            allocatedAmount: resource.allocatedAmount,
            remainingAmount: resource.remainingAmount,
        }));

        // Add summary data as a separate row
        const summary = {
            medID: 'Summary',
            productName: '',
            brand: '',
            allocatedAmount: resources.reduce((sum, r) => sum + r.allocatedAmount, 0),
            remainingAmount: resources.reduce((sum, r) => sum + r.remainingAmount, 0),
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
        res.attachment('medical_resource_report.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/
export default router