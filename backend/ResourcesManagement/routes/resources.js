import { Router } from 'express';

import {getResources,getResourceBiID,createResource,deleteResource,updateResource}
 from '../controllers/recoursecontroller.js'; 
const router = Router();


router.get('/report', getResources);


router.get('/:id', getResourceBiID);


router.post('/report', createResource);


router.put('/report/:id', updateResource);


router.delete('/report/:id', deleteResource);

router.get('/report', generateReport);
export default router