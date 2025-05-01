import User from "../shared/models/userModel.js";
import Vehicle from "../VehicleManagement/models/vehicleModel.js";
import CallOpSocket from "./CallOpSocket.js";

class CallOpManager {
    constructor(server) {
        console.log("callop manager started");
        if (CallOpManager.instance) {
            return CallOpManager.instance;
        }
        CallOpManager.instance = this;

        this.callOpSocket = new CallOpSocket(server, this);

        this.socketToCallop = {};
        this.activeCallop = new Map();
    }

    // get fleetmanagement instance
    static getInstance() {
        if (CallOpManager.instance) {
            return CallOpManager.instance;
        }
        throw new Error("CallOpManager is not intialized yet");
    }

    async addActiveCallop(socketId, callopId) {
        try {
            // get callop data
            const callop = await User.findById(callopId);

            if (!callop) {
                throw new Error("callop id not found")
            }
            // set callop data
            this.socketToCallop[socketId] = callop._id;
            this.activeCallop.set(callop._id.toString(), {
                socketId,
                callop: callop,
                vehicles: [],
            });
            this.callOpSocket.sendMessage(socketId, "callop_connected", ""); // send confirmation message
            console.log("new active callop: ", callop._id);
        } catch (error) {
            this.callOpSocket.sendMessage(
                socketId,
                "callop_connection_error",
                error.message
            ); // send error message
        }
    }

    // add vehicles to call op
    async addVehicle(socketId, vin, driverId, callopId) {
        try {
            // get vehicle from database 
            const vehicle = await Vehicle.findOne({vin, driver: driverId})
            
            if (!vehicle) {
                throw new Error("vehicle not found")
            }

            // get the callop
            const callop = this.getActiveCallop(callopId);

            // update the connected vehicle list
            callop.vehicles.push({ socketId: vehicle });

            // send message to both vehicle and the call op
            this.callOpSocket.sendMessage(
                socketId,
                "callop_vehicle_connect",
                ""
            ); // send to vehicle
            this.callOpSocket.sendMessage(
                callop.socketId,
                "callop_vehicle_connect",
                { vehicle }
            );

            console.log("callop socket: vehicle connected - ", vin)
        } catch (error) {
            this.callOpSocket.sendMessage(
                socketId,
                "callop_vehicle_connect_error",
                error.message
            ); // send error
        }
    }

    getActiveCallop(callopId) {
        // check the if vehile exists
        if (!this.activeCallop.get(callopId.toString())) {
            throw new Error("callop is not connected to the fleet");
        }

        return this.activeCallop.get(callopId.toString());
    }

    handleDisconnect(socketId) {
        // handle disconnect
        console.log("disconnect");
    }
}

export default CallOpManager;
