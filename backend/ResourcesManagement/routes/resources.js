import { Router } from 'express';
import requireAuth from '../../shared/middleware/requireAuth.js'
import requireManager from '../middleware/requireManager.js'


import {getResources,getResourceBiID,createResource,deleteResource,updateResource, generateReport }
from '../controllers/recoursecontroller.js'; 

import{resourse_manager_login}
from '../controllers/resoursemangerLogin.js'; 

import {getSchedule,getScheduleBiID,createSchedule,deleteSchedulefull,deleteSchedule,updateSchedule }
from '../controllers/scheduleController.js';


<<<<<<< Updated upstream

/*import {getUsers,getUserByID,createNewUser,deleteUser,updateUser }
from '../controllers/Staffcontroller.js';*/
=======
import {getUsers,getUserByID,createNewUser,deleteUser,updateUser }
from '../controllers/Staffcontroller.js';
>>>>>>> Stashed changes

import {createLeaveRequest,getMyLeaveRequests,getAllLeaveRequests,updateLeaveRequest,deleteLeaveRequest,getNotifications}
from '../controllers/leaveController.js';


<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
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


router.post('/schedule', createSchedule);


router.put('/schedule/:id', updateSchedule);


router.delete('/schedule/:id', deleteSchedulefull);

router.delete('/schedule/:id', deleteSchedule);



//leave management

router.post('/leave',createLeaveRequest);

router.get('/leave/my-requests',getMyLeaveRequests);

router.get('/leave/all-requests',getAllLeaveRequests);

router.put('/leave/:id',updateLeaveRequest);

router.delete('/leave/:id',deleteLeaveRequest);

//router.get('/leave/notifications', getNotifications);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes

export default router

