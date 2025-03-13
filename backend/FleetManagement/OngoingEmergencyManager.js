import OngoingEmergency from './OngoingEmergency.js';

class EmergencyManager {
    constructor(fleetManager) {
        this.fleetManager = fleetManager
        this.activeEmergencies = {}; 
    }

    addEmergency(emergency) {
        this.activeEmergencies[emergency._id] = {
            emergency,
            assignedStatus: 'pending'
        }
        console.log(`Emergency added: ${emergency._id}`);
    }

    assignVehicle(emergencyId, vehicleId) {
        if (!this.activeEmergencies[emergencyId]) {
            console.log(`Emergency ${emergencyId} not found.`);
            return;
        }
        if (this.activeEmergencies[emergencyId].assignedStatus == 'assigned') {
            console.log(`Emergency ${emergencyId} not found.`);
            return;
        }


        // Notify the assigned vehicle
        this.io.to(vehicleId).emit("emergency_assigned", {
            emergency: this.activeEmergencies[emergencyId].emergency
        });

        console.log(`Emergency ${emergencyId} assigned to vehicle ${vehicleId}`);
    }

    completeEmergency(emergencyId) {
        if (!this.activeEmergencies[emergencyId]) return;
        
        this.activeEmergencies[emergencyId].status = "completed";
        
        // Emit event to notify that the emergency is completed
        this.io.emit("emergency_completed", { emergencyId });

        console.log(`Emergency ${emergencyId} marked as completed.`);
        
        // Remove from active emergencies
        delete this.activeEmergencies[emergencyId];
    }

    getActiveEmergencies() {
        return this.activeEmergencies;
    }
}

class OngoingEmergencyManager {
    constructor(fleetManager) {
        this.fleetManager = fleetManager
        this.ongoingEmergencies = new Map();
    }

    async addEmergency(emergency, nearbyVehicleList) {
        // add a new ongoing emergency
        this.ongoingEmergencies.set(emergency._id.toString(), new OngoingEmergency(emergency, nearbyVehicleList))
    }

    nextNearVehicleId(emergencyId) {
        return this.ongoingEmergencies.get(emergencyId.toString()).getNextNearVehicleId()    
    }

    addRequestedVehicle(emergencyId, vehicleId) {
        if (!this.ongoingEmergencies.has(emergencyId.toString())) {
            console.error("Emergency not found");
            throw new Error("Emergency not found")
        }

        const emergency = this.ongoingEmergencies.get(emergencyId.toString());

        emergency.addRequestedVehicle(vehicleId)
    }

    async handleAcceptEmergency(emergencyId, vehicleId) {
        if (!this.ongoingEmergencies.has(emergencyId.toString())) {
            console.error("Emergency not found");
            throw new Error("Emergency not found")
        }

        const emergency = this.ongoingEmergencies.get(emergencyId.toString());

        // assign vehicle to a patient 
        await emergency.assignVehicle(vehicleId)
        
        // if all patients have a vehicle
        // send a cancel message to rest of the requested vehicles
        if (emergency.isAssigned()) {
            const otherVehicleIds = emergency.getPendingVehicles()
            for (const vehicleId of otherVehicleIds) {
                this.fleetManager.sendCancelMessage(vehicleId, emergency.id)
                emergency.cancelVehicleRequest(vehicleId)
            }
        }
    }
}


export default OngoingEmergencyManager;