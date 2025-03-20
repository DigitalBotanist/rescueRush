
// check if the logged user is an admin
const requireMaintainer = (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin' && user.role !== 'maintainer' ) {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

export default requireMaintainer 