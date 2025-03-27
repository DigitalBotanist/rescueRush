import { Router } from 'express';
import requireAuth from '../../shared/middleware/requireAuth.js'
import requireManager from '../middleware/requireManager.js'


import {getResources,getResourceBiID,createResource,deleteResource,updateResource, generateReport }
from '../controllers/recoursecontroller.js'; 

import{resourse_manager_login}
from '../controllers/resoursemangerLogin.js'; 

const router = Router();
router.post('/resourse_manager', resourse_manager_login);
router.use(requireAuth)
router.use(requireManager)

router.get('/resourse', getResources);


router.get('/resourse:id', getResourceBiID);


router.post('/resourse', createResource);


router.put('/resourse/:id', updateResource);


router.delete('/resourse/:id', deleteResource);

router.get('/report', generateReport);
export default router

