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

    // update database 
    // set all vehicles offline 
    async setAllVehiclesOffline() {
        console.log("setting all vehicle offline")
        await Vehicle.setAllVehiclesOffline()
    }

    // get fleetmanagement instance 
    static getInstance() {
        if (FleetManager.instance) {
            return FleetManager.instance
        }
        throw new Error("FleetManager is not intialized yet")
    }

    //  add active vehicles to fleetmanager when comes online 
    // to keep track of all the vehicles and their sockets
    async addActiveVehicle(socketId, vehicle, user) {
        this.socketToVehicle[socketId] = vehicle._id
        this.activeVehicles.set(vehicle._id.toString(), {socketId, vehicle})
        try {
            await Vehicle.updateOne({vin: vehicle.vin}, {$set: { status: "active", driver: user._id}})
            this.fleetSocket.sendMessage(socketId, "fleet_connected", '') // send error message 
        } catch (error) {
            this.fleetSocket.sendMessage(socketId, "fleet_connection_error", error.message) // send error message 
        }
        console.log('new active vehicle: ', vehicle.id)
    }

    // handle new emergency 
    async addEmergency(emergency) {
        console.log("adding a new emergency")
        
        // check if there are any active vehiles 
        if (!this.activeVehicles.size) {
            console.log("No active vehicles available");
            //todo: notify call op 
        }

        // get the vehicle id list ordered by the distance to patient 
        const [lng, lat] = emergency.location.coordinates;
        const nearestVehicles = await Vehicle.getNearestVehicleIds(lng, lat);
        const nearestVehicleIds = nearestVehicles.map(v => v._id);

        // check if there are any nearby vehicles 
        if (!nearestVehicleIds.length) {
            console.log("No active vehicles available");
            return { message: "No active vehicles" };
        }

        // add new emergency to the emergency manager 
        await this.emergencyManager.addEmergency(emergency, nearestVehicleIds)

        // Notify up to 5 vehicles nearby  
        for (let i = 0; i < 5; i++) {
            const vehicleId = this.emergencyManager.nextNearVehicleId(emergency._id)

            // if there aren't any more nearby vehicles stop sending requests 
            if (vehicleId == undefined) {
                break
            }
            
            // send request to vehicle 
            this.sendNewRequest(vehicleId, emergency)
            this.emergencyManager.addRequestedVehicle(emergency._id.toString(), vehicleId)  
        } 
    }

    // handle accept emegency message from the vehicle 
    async handleAcceptEmergency(socketId, emergencyId) {
        const vehicleId = this.socketToVehicle[socketId] // get vehicle if from socketId 
        try {
            await this.emergencyManager.handleAcceptEmergency(emergencyId, vehicleId);
            this.fleetSocket.sendMessage(socketId, "assigned", emergencyId) // send assign confimation message
        } catch(error) {
            this.fleetSocket.sendMessage(socketId, "accept_error", error.message) // send error message 
        }
    }

    // todo: handle the reject request 
    async handleRejectRequest(socketId, emergencyId) {
        const vehicleId = this.socketToVehicle[socketId]
        try {
            await this.emergencyManager.handleRejectEmergency(emergencyId, vehicleId);
            this.fleetSocket.sendMessage(socketId, "reject_confirm", emergencyId) // send assign confimation message

            const nextVehicleId = this.emergencyManager.nextNearVehicleId(emergencyId)
            const emergency = this.emergencyManager.getEmergency(emergencyId)

            // if there aren't any more nearby vehicles stop sending requests 
            if (nextVehicleId == undefined) {
                console.log("there are no more vehicles")
                return 
            }
            
            // send request to vehicle 
            this.sendNewRequest(nextVehicleId, emergency)
            this.emergencyManager.addRequestedVehicle(emergency._id.toString(), nextVehicleId)
        } catch(error) {
            this.fleetSocket.sendMessage(socketId, "accept_error", error.message) // send error message 
        }
    }

    // send the new emergency request 
    sendNewRequest(vehicleId, emergency) {
        console.log("sending new request: ", vehicleId)
        const socketId = this.activeVehicles.get(vehicleId.toString()).socketId; // get socket id from vehicle id 

        this.fleetSocket.sendMessage(socketId, "new_request", emergency)
    }  

    // if emergency is assinged 
    // send a cancel message to the vehicle 
    sendCancelMessage(vehicleId, emergencyId) {
        const socketId = this.activeVehicles.get(vehicleId.toString()).socketId; // get socket id from vehicle id 

        this.fleetSocket.sendMessage(socketId, "request_cancel", emergencyId)
    }

    // update location of a vehicle 
    async updateLocation(socketId, location) {
        const vehicleId = this.socketToVehicle[socketId] // get vehicle if from socketId 
        try {
            const updatedVehicle = await Vehicle.updateLocation(vehicleId, location.location)

            this.fleetSocket.sendMessage(socketId, "location_update_successful", updatedVehicle)  
        } catch(error) {
            this.fleetSocket.sendMessage(socketId, "location_update_error", error.message) // send error message 
        }
    }

    // remove vehicle from the socketToVehicle and activeVehicle lists 
    async handleDisconnect(socketId) {

        const vehicleId = this.socketToVehicle[socketId]
        console.log("disconnecting:", vehicleId, "  .... ")
        await Vehicle.setVehicleOffline(this.activeVehicles.get(vehicleId.toString()).vehicle._id)  // set vehicle offline 

        // delete from activeVehicle lists 
        this.activeVehicles.delete(vehicleId.toString())
        delete this.socketToVehicle[vehicleId]
}
}

export default FleetManager