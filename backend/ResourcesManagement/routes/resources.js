import { Router } from 'express';


import {getResources,getResourceBiID,createResource,deleteResource,updateResource, generateReport }
from '../controllers/recoursecontroller.js'; 

import{resourse_manager_login}
from '../controllers/resoursemangerLogin.js'; 

const router = Router();

router.get('/resorse', getResources);


router.get('/resorse:id', getResourceBiID);


router.post('/resorse', createResource);


router.put('/resorse/:id', updateResource);


router.delete('/resorse/:id', deleteResource);

router.get('/report', generateReport);
export default router

router.post('/resourse_manager', resourse_manager_login);