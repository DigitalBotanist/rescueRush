import User from "../shared/models/userModel.js";
import vehicleModel from "../VehicleManagement/models/vehicleModel.js";
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
                throw new Error("callop id not found");
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
            const vehicle = await Vehicle.findOne({ vin, driver: driverId });

            if (!vehicle) {
                throw new Error("vehicle not found");
            }

            // get the callop
            const callop = this.getActiveCallop(callopId);

            // update the connected vehicle list
            callop.vehicles.push({ socketId, vehicle, peerId: null });

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

            console.log("callop socket: vehicle connected - ", vin);
        } catch (error) {
            this.callOpSocket.sendMessage(
                socketId,
                "callop_vehicle_connect_error",
                error.message
            ); // send error
        }
    }

    registerPeer(socketId, type, receiverId, peerId) {
        // type: incoming type, if coming from vehicle -> type = vehicle
        try {
            if (type === "vehicle") {
                const vehicle = this.getVehicleFromSocketId(
                    receiverId,
                    socketId
                );
                console.log(vehicle);
                vehicle.peerId = peerId;

                const callop = this.getActiveCallop(receiverId)
                this.callOpSocket.sendMessage(
                    callop.socketId,
                    "register_peer",
                    { vehicle, peerId }
                );
            } else {
                // todo: if type is call op
                this.callOpSocket.sendMessage(
                    socketId,
                    "register_peer",
                    peerId
                );
            }
        } catch (error) {
            this.callOpSocket.sendMessage(
                socketId,
                "register_peer_error",
                error.message
            );
        }
    }

    assignPeer(socketId, type, receiverId, peerId) {
        // type: incoming type, if coming from vehicle -> type = vehicle
        try {
            console.log("receiver id", receiverId)
            if (type == "callop") {
                const callopId = this.getCallopIdFromSocketId(socketId);
                const vehicle = this.getVehicleFromVehicleId(
                    callopId,
                    receiverId
                );

                console.log("peerid", peerId)
                this.callOpSocket.sendMessage(
                    vehicle.socketId,
                    "assign_peer",
                    peerId
                );
            } else {
                //todo: handle if the type is callop
            }
        } catch (error) {
            console.log(error.message)
            this.callOpSocket.sendMessage(
                socketId,
                "assign_peer_error",
                error.message
            );
        }
    }

    getCallopIdFromSocketId(socketId) {
        const callopId = this.socketToCallop[socketId];

        if (callopId == null) {
            throw new Error("call op is not connected to the socket");
        }

        return callopId
    }

    getActiveCallop(callopId) {
        // check the if vehile exists
        if (!this.activeCallop.get(callopId.toString())) {
            throw new Error("callop is not connected to the fleet");
        }

        return this.activeCallop.get(callopId.toString());
    }

    getVehicleFromSocketId(callopId, socketId) {
        const callOp = this.getActiveCallop(callopId);
        const vehicles = callOp.vehicles;

        // Check if vehicles array is empty
        if (!vehicles || vehicles.length === 0) {
            throw new Error("No vehicles connected");
        }

        for (const vehicle of vehicles) {
            console.log(vehicle)
            if (vehicle.socketId === socketId) {
                return vehicle;
            }
        }

        throw new Error("vehicle isn't connected to the server");
    }

    getVehicleFromVehicleId(callopId, vehicleId) {
        const callOp = this.getActiveCallop(callopId);

        const vehicles = callOp.vehicles;
        // check if vehicles is empty
        if (vehicles.length === 0) {
            throw new Error("no vehilces connected");
        }

        for (const vehicle of vehicles) {
            if (vehicle.vehicle._id == vehicleId) {
                return vehicle;
            }
        }
        throw new Error("vehicle isn't connected to the server");
    }

    handleDisconnect(socketId) {
        // handle disconnect
        console.log("disconnect");
    }
}

export default CallOpManager;
