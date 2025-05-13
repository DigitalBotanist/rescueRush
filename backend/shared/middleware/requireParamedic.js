// check if the logged user is an admin or paramedic
const requireParamedic = (req, res, next) => {
    const user = req.user
    if (user.role !== 'paramedic' ) {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

export default requireParamedic 