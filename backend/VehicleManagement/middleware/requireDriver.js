
// check if the logged user is an admin
const requireDriver = (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin' && user.role !== 'driver' ) {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

module.exports = requireDriver 