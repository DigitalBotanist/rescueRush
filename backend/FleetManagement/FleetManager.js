const Vehicle = require('../VehicleManagement/models/vehicleModel')

const FleetSocket = require("./FleetSocket");
const OngoingEmergencyManager = require("./OngoinEmergencyManager");

class FleetManager {
    constructor(server) {
        if (FleetManager.instance) {
            return FleetManager.instance
        }
        FleetManager.instance = this

        this.emergencyManager = new OngoingEmergencyManager(this);
        this.fleetSocket = new FleetSocket(server, this);

        this.activeVehicles = new Map()
        this.socketToVehicle = new Map()
    }

    AddActiveVehicle(socketId, vehicle) {
        this.socketToVehicle[socketId] = vehicle._id
        this.activeVehicles[vehicle._id] = {socketId, vehicle}
        console.log('new active vehicle: ', vehicle.id)
    }

    async addEmergency(emergency) {
        if (!this.activeVehicles.length) {
            console.log("No active vehicles available");
            //todo: notify call op 
        }

        const [lng, lat] = emergency.location.coordinates;
        const nearestVehicles = await Vehicle.getNearestVehicles(lng, lat);

        if (!nearestVehicles.length) {
            console.log("No active vehicles available");
            return { message: "No active vehicles" };
        }

        this.emergencyManager.addEmergency(emergency, nearestVehicles)

        // Notify up to 5 vehicles about the emergency
        for (const vehicle of nearestVehicles.slice(0, 5)) {
            this.fleetSocket.sendEmergencyRequest(vehicle._id, emergency);
        }

        return emergency;
    }

    async handleAcceptEmergency(emergencyId, vehicleId) {
        return this.emergencyManager.handleAcceptEmergency(emergencyId, vehicleId);
    }
}

module.exports = FleetManager;
