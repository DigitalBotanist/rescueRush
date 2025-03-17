import { Server } from "socket.io";
import jwt from 'jsonwebtoken'
import User from '../shared/models/userModel.js'
import Vehicle from '../VehicleManagement/models/vehicleModel.js'


// socket to connect vehicles to the fleet manager
class FleetSocket {
    constructor(server, fleetManager) {
        this.io = new Server(server);
        this.fleetManager = fleetManager;

        this.setupMiddleware()
        this.listener()
    }

    setupMiddleware() {
        // authenticate
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth?.token || socket.handshake.headers.token;

                // if token doesn't exist return error 
                if (!token) return next(new Error("Authentication error: No token provided"));

                // verify user
                const { _id } = jwt.verify(token, process.env.SECRET);
                const user = await User.findOne({ _id }).select("_id role");
                if (user.role !== 'admin' && user.role !== 'driver' ) {
                    return next(new Error("Authentication error: Permission denied"));
                }

                // check if the user is assigned to a vehicle 
                const vehicle = await Vehicle.findOne({ driver: _id });
                if (!vehicle) return next(new Error("No vehicle assigned to this user"));  // if user not assign to vehicle throw error 

                socket.user = user;
                socket.vehicle = vehicle;
                next();
            } catch (error) {
                next(new Error("Authentication error: Invalid token"));
            }
        });
    }

    listener() {
        this.io.on("connection", (socket) => {
            // Todo: remove ?
            const { vehicle } = socket;
            if (!vehicle) return;

            this.fleetManager.addActiveVehicle(socket.id, vehicle) // add connected vehicle to the fleet manager
            console.log(`Vehicle connected: ${socket.id}`);

            // emergency request accept 
            socket.on("accept_request", (emergencyId) => {
                this.fleetManager.handleAcceptEmergency(socket.id, emergencyId);
            });

            // emergency request rejected
            socket.on("reject_request", (emergencyId) => {
                this.fleetManager.handleRejectRequest(socket.id, emergencyId)
            })

            socket.on("location_update", (location) => {
                this.fleetManager.updateLocation(socket.id, location)
            })

            // handle disconnect  
            socket.on("disconnect", () => {
                this.fleetManager.handleDisconnect(socket.id)
            });
        });
    }

    /* 
        send message to a connected vehicle 
        params: 
            socketId - socketId of the vehicle socket 
            event - event name 
            message  
    */
    sendMessage(socketId, event, message) {
        console.log("sending message: ", socketId, event, message)
        this.io.to(socketId).emit(event, message)
    }
}


export default FleetSocket