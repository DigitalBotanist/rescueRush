import { Router } from 'express';

import {getResources,getResourceBiID,createResource,deleteResource,updateResource}
 from '../controllers/recoursecontroller.js'; 
const router = Router()

// GET all resources
router.get('/resources', getResources);

// GET a single resource by ID
router.get('/resources:id', getResourceBiID);

// POST a new resource
router.post('/resources', createResource);

// PUT to update a resource by ID
router.put('/resources/:id', updateResource);

// DELETE a resource by ID
router.delete('/resources/:id', deleteResource);
export default router