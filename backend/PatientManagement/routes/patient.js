
import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.json({messg: "patient"})
})

export default router