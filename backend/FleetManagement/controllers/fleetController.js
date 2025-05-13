import Vehicle from "../../VehicleManagement/models/vehicleModel.js";
import User from "../../shared/models/userModel.js";
import FleetManager from "../FleetManager.js";

export const paramedicLogin = async (req, res) => {
    const fleetManager = FleetManager.getInstance(); // get fleetmanager instance

    const user = req.user;
    const { vin } = req.body;

    try {
        // check if paramedic is registered to the vehilce
        const vehicle = await Vehicle.findOne({ vin, paramedic: user._id });

        console.log(vehicle);
        if (!vehicle) {
            res.status(400).json({
                error: "paramedic is not registered to the vehicle",
            });
            return;
        }

        // get the paramedic details
        const vehicleWithPatient = await vehicle.populate([
            {
                path: "paramedic",
                model: "User",
                select: "firstName lastName email profileImage",
            },
        ]);
        const paramedic = await User.findById(user._id);
        const safeParamedic = paramedic.toObject();
        delete safeParamedic.password; // delete the password hash

        console.log(vehicleWithPatient)
        // send data to the fleetmanager
        fleetManager.handleParamedicLogin(vehicleWithPatient, safeParamedic);
        res.status(200).json({});
    } catch (error) {
        res.json(400).json({ error: error.message });
    }
};
