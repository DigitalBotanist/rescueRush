import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../shared/models/userModel.js";
import Vehicle from "../VehicleManagement/models/vehicleModel.js";

// socket to connect
class CallOpSocket {
    constructor(server, callOpManager) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
            },
        });
        this.callOpManager = callOpManager;

        this.setupMiddleware();
        this.listener();
    }

    setupMiddleware() {
        // authenticate
        this.io.use(async (socket, next) => {
            try {
                // get token
                const token =
                    socket.handshake.auth?.token ||
                    socket.handshake.headers.token;

                // if token doesn't exist return error
                if (!token)
                    return next(
                        new Error("Authentication error: No token provided")
                    );

                // verify user
                const { _id } = jwt.verify(token, process.env.SECRET);
                const user = await User.findOne({ _id }).select("_id role");
                if (
                    user.role !== "admin" &&
                    user.role !== "callop" &&
                    user.role !== "driver"
                ) {
                    return next(
                        new Error("Authentication error: Permission denied")
                    );
                }

                socket.user = user;
                next();
            } catch (error) {
                next(new Error("Authentication error: Invalid token"));
            }
        });
    }

    listener() {
        this.io.on("connection", (socket) => {
            console.log("socket connected: ", socket.id);

            // handle call op connect
            socket.on("connect_callop", (callopId) => {
                this.callOpManager.addActiveCallop(socket.id, callopId);
            });

            socket.on("connect_vehicle", (data) => {
                const { callopId, vin, driverId } = data;
                this.callOpManager.addVehicle(socket.id, vin, driverId, callopId);
            });

            //register peer to call 
            socket.on("register_peer", (data) => {
                const { peerId, type, receiverId } = data;
                this.callOpManager.registerPeer(socket.id, type, receiverId, peerId)
            });

            // handle disconnect
            socket.on("disconnect", () => {
                this.callOpManager.handleDisconnect(socket.id);
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
        console.log("sending message: ", socketId, event);
        this.io.to(socketId).emit(event, message);
    }
}

export default CallOpSocket;
