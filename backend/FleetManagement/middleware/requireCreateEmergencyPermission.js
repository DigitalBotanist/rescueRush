
const requireCreateEmergencyPermission = (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin' && user.role !== 'callop' ) {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}


module.exports = requireCreateEmergencyPermission