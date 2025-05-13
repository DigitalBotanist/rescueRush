
// check if the logged user is an admin or driver 
const requireDriver = (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin' && user.role !== 'driver' ) {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

export default requireDriver 