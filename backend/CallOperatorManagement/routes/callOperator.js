import { Router } from "express";
import requireAuth from "../../shared/middleware/requireAuth.js";
import { callOpLogin, createEmergency } from "../controllers/callOperator.js";
import requireCallOp from "../middleware/requireCallOp.js";

const router = Router();

router.post('/login', callOpLogin)

router.use(requireAuth);
router.use(requireCallOp);

router.post('/new_emergency', createEmergency)
export default router;
