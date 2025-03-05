
// check if the logged user is an admin
const requireAdmin = (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin') {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

module.exports = requireAdmin