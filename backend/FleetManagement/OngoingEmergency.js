
class OngoingEmergency {
    constructor(emergency, nearbyVehicleList) {
        this.id = emergency._id;
        this.emergency = emergency;
        this.status = "pending"; 
        this.nearbyVehiclesList = nearbyVehicleList
        this.requestStatus = {}
        this.acceptedCount = 0

        init()
    }

    init() {
        for(let i = 0; i < 5; i++) {
            if (this.nearbyVehiclesList === 0) {
                console.log("nearby vehicle list empty")
                return 
            }

            const vehicle = this.nearbyVehiclesList.shift()
            sendEmergencyRequest(vehicle)
            this.requestStatus[vehicle] = 'pending'
        }
    }

    handleAcceptMessage(vehicleId) {
        // if all patients have a vehicle reject and send message 

        console.log(`🚑 Emergency ${this.id} assigned to vehicle ${vehicleId}`);
    }

    completeEmergency() {
        if (this.status !== "assigned") {
            throw new Error("Emergency must be assigned before completing.");
        }
        this.status = "completed";
        console.log(`✅ Emergency ${this.id} marked as completed.`);
    }

    sendEmergencyRequest(vehicleId) {
        try {
            console.log('vehi map', vehicleSocketMap)
            const socketId = vehicleSocketMap[vehicleId].socketId

            io.to(socketId).emit("new_request", {emergency});
            console.log(`Message sent to ${socketId}: ${emergency}`);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    getInfo() {
        return {
            id: this.id,
            status: this.status,
            vehicleId: this.vehicleId,
            emergency: this.emergency,
        };
    }
}

export default OngoingEmergency;
