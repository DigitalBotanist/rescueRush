import { Router } from 'express';
import requireAuth from '../../shared/middleware/requireAuth.js'
import requireManager from '../middleware/requireManager.js'

import {getResources,getResourceBiID,createResource,deleteResource,updateResource, generateReport }
from '../controllers/recoursecontroller.js'; 

import{resourse_manager_login}
from '../controllers/resoursemangerLogin.js'; 

import {getSchedules,getScheduleByID,createSchedule,deleteSchedulefull,deleteScheduleById,updateSchedule, getAllDriver, getAllParamedic, getAllVehicles }
from '../controllers/scheduleController.js';

import {getUsers,getUserByID,createNewUser,deleteUser,updateUser }
from '../controllers/Staffcontroller.js';

import {createLeaveRequest,getMyLeaveRequests,getAllLeaveRequests,updateLeaveRequest,deleteLeaveRequest,getNotifications}
from '../controllers/leaveController.js';

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
router.get('/schedule', getSchedules);


router.get('/schedule:id', getScheduleByID);


router.post('/schedules', createSchedule);


router.put('/schedule/:id', updateSchedule);


router.delete('/schedule/full', deleteSchedulefull);

router.delete('/schedule/:id', deleteScheduleById );

router.get('/drivers',getAllDriver)
router.get('/paramedics',getAllParamedic)
router.get('/vehicles', getAllVehicles)


//staff part

router.get('/user', getUsers);


router.get('/user:id', getUserByID);


router.post('/user', createNewUser);


router.put('/user/:id', updateUser);


router.delete('/user/:id', deleteUser);

//leave management

router.post('/leave',createLeaveRequest);

router.get('/leave/my-requests',getMyLeaveRequests);

router.get('/leave/all-requests',getAllLeaveRequests);

router.put('/leave/:id',updateLeaveRequest);

router.delete('/leave/:id',deleteLeaveRequest);

router.get('/leave/notifications', getNotifications);



export default router

