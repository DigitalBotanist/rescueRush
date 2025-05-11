import { Router } from 'express';
import requireAuth from '../../shared/middleware/requireAuth.js'
import requireManager from '../middleware/requireManager.js'

import {getResources,getResourceBiID,createResource,deleteResource,updateResource, generateReport }
from '../controllers/recoursecontroller.js'; 

import{resourse_manager_login}
from '../controllers/resoursemangerLogin.js'; 

import {getSchedule,getScheduleBiID,createSchedule,deleteSchedulefull,deleteSchedule,updateSchedule }
from '../controllers/scheduleController.js';

<<<<<<< HEAD
import {getUsers,getUserByID,createNewUser,deleteUser,updateUser }
from '../controllers/Staffcontroller.js';

import {createLeaveRequest,getMyLeaveRequests,getAllLeaveRequests,updateLeaveRequest,deleteLeaveRequest,getNotifications}
from '../controllers/leaveController.js';

=======
>>>>>>> a6da65aa61161caf2b89a2c5a3036d74ccfaaae3
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


//schdule part
router.get('/schedule', getSchedule);


router.get('/schedule:id', getScheduleBiID);


router.post('/schedules', createSchedule);


router.put('/schedule/:id', updateSchedule);


router.delete('/schedule/:id', deleteSchedulefull);

router.delete('/schedule/:id', deleteSchedule);


//leave management

router.post('/leave',createLeaveRequest);

router.get('/leave/my-requests',getMyLeaveRequests);

router.get('/leave/all-requests',getAllLeaveRequests);

router.put('/leave/:id',updateLeaveRequest);

router.delete('/leave/:id',deleteLeaveRequest);

router.get('/leave/notifications', getNotifications);



export default router

