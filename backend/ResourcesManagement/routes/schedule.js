import { Router } from 'express';

import {getschedule,getscheduleBiID,createchedule,deleteSchedulefull,deleteSchedule,updatechedule }
from '../controllers/scheduleController.js'; 

router.get('/schedule', getschedule);


router.get('/schedule:id', getscheduleBiID);


router.post('/schedule', createchedule);


router.put('/schedule/:id', updatechedule);


router.delete('/schedule/:id', deleteSchedulefull);

router.delete('/schedule/:id', deleteSchedule);

