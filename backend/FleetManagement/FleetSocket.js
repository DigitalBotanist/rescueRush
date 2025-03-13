const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

class FleetSocket {
    constructor(server, fleetManager) {
        this.io = socketIo(server);
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
                if (!vehicle) return next(new Error("No vehicle assigned to this user"));

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
            const { vehicle } = socket;
            if (!vehicle) return;

            this.fleetManager.addActiveVehicle(socket.id, vehicle)

            console.log(`Vehicle connected: ${socket.id}`);

            socket.on("accept_request", (emergencyId) => {
                this.handleAcceptEmergency(socket, emergencyId);
            });

            socket.on("disconnect", () => {
                this.handleDisconnect(socket);
            });
        });
    }

    sendMessage(socketId, event, message) {
        this.io.to(socketId).emit(event, message)
    }
}

module.exports = FleetSocket;
