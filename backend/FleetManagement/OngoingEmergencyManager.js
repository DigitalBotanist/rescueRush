import OngoingEmergency from './OngoingEmergency';

class OngoingEmergencyManager {
    constructor(io) {
        this.io = io;
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


class EmergencyManager {
    constructor() {
        this.ongoingEmergencies = new Map();
    }

    async addEmergency(emergency, nearbyVehicleList) {
        // add a new ongoin emergency
        this.ongoingEmergencies[emergency._id] = new OngoingEmergency(emergency, nearbyVehicleList)
    }

    async handleAcceptEmergency(emergencyId, vehicleId) {
        if (!this.ongoingEmergencies.has(emergencyId)) {
            console.error("Emergency not found");
            return;
        }

        const emergency = this.ongoingEmergencies.get(emergencyId);
        const unassignedPatients = emergency.patients.filter(p => !p.vehicle);

        if (!unassignedPatients.length) {
            throw new Error("All patients have been assigned vehicles");
        }

        // Assign the vehicle to the first available patient
        unassignedPatients[0].vehicle = vehicleId;
        console.log(`Vehicle ${vehicleId} assigned to emergency ${emergencyId}`);
    }
}


export default OngoingEmergencyManager;