
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({messg: "ambulance"})
})

module.exports = router