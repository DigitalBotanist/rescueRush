
// check if the logged user is an admin
const requireHospitalStaff = (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin' && user.role !== 'hospital_staff' ) {
        return res.status(403).json({error: "Permission denied"})

    }
    next()
}

export default requireHospitalStaff 