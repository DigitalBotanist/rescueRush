import Vehicle from '../VehicleManagement/models/vehicleModel.js'

import FleetSocket from './FleetSocket.js';
import OngoingEmergencyManager from './OngoingEmergencyManager.js'

class FleetManager {
    constructor(server) {
        console.log("fleet manager started")
        if (FleetManager.instance) {
            return FleetManager.instance
        }
        FleetManager.instance = this

        this.emergencyManager = new OngoingEmergencyManager(this);
        this.fleetSocket = new FleetSocket(server, this);

        this.socketToVehicle = {} 
        this.activeVehicles = new Map()
    }

    static getInstance() {
        if (FleetManager.instance) {
            return FleetManager.instance
        }
        throw new Error("FleetManager is not intialized yet")
    }

    addActiveVehicle(socketId, vehicle) {
        this.socketToVehicle[socketId] = vehicle._id
        this.activeVehicles.set(vehicle._id.toString(), {socketId, vehicle})
        console.log('new active vehicle: ', vehicle.id)
    }

    async addEmergency(emergency) {
        console.log("adding a new emergency")
        if (!this.activeVehicles.size) {
            console.log("No active vehicles available");
            //todo: notify call op 
        }

        const [lng, lat] = emergency.location.coordinates;
        const nearestVehicles = await Vehicle.getNearestVehicleIds(lng, lat);
        const nearestVehicleIds = nearestVehicles.map(v => v._id);

        if (!nearestVehicleIds.length) {
            console.log("No active vehicles available");
            return { message: "No active vehicles" };
        }

        await this.emergencyManager.addEmergency(emergency, nearestVehicleIds)

        // Notify up to 5 vehicles about the emergency
        for (let i = 0; i < 5; i++) {
            const vehicleId = this.emergencyManager.nextNearVehicleId(emergency._id)

            if (vehicleId == undefined) {
                break
            }
            
            this.sendNewRequest(vehicleId, emergency)
            this.emergencyManager.addRequestedVehicle(emergency._id.toString(), vehicleId)
        } 
    }

    async handleAcceptEmergency(socketId, emergencyId) {
        console.log(emergencyId)
        const vehicleId = this.socketToVehicle[socketId]
        try {
            await this.emergencyManager.handleAcceptEmergency(emergencyId, vehicleId);
            this.fleetSocket.sendMessage(socketId, "assigned", emergencyId)
        } catch(error) {
            this.fleetSocket.sendMessage(socketId, "accept_error", error.message)
        }
    }

    sendNewRequest(vehicleId, emergency) {
        console.log("sending new request: ", vehicleId)
        console.log(this.activeVehicles)
        const socketId = this.activeVehicles.get(vehicleId.toString()).socketId;
        this.fleetSocket.sendMessage(socketId, "new_request", emergency)
    }  

    sendCancelMessage(vehicleId, emergencyId) {
        const socketId = this.activeVehicles.get(vehicleId.toString()).socketId;
        this.fleetSocket.sendMessage(socketId, "request_cancel", emergencyId)
    }

    // handleDisconnect(socketId) {
    // }
}

export default FleetManager