import { Router } from 'express';
import { resourse_manager_login } from '../controllers/resoursemanagerLogin.js';

const router = Router();

router.post('/resourse_manager_login', resourse_manager_login);

export default router;