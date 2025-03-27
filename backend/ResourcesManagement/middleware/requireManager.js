// check if the logged user is an manager
const requireManager = (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin' && user.role !== 'manager' ) {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

export default requireManager 