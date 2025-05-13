import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../shared/models/userModel.js";
import Vehicle from "../VehicleManagement/models/vehicleModel.js";

// socket to connect
class CallSocket {
    constructor(server, callManager) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
            },
        });
        this.callManager = callManager;

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

            const { user } = socket;
            this.callManager.addUser(socket.id, user._id);

            socket.on("call_request", ({receiverId, peerId}) => {
                this.callManager.handleCallRequest(socket.id, receiverId, peerId)
            });

            socket.on("accept_call", ({senderId, peerId}) => {
                this.callManager.handleAcceptCall(socket.id, senderId, peerId)
            });

            socket.on("reject_call", ({senderId}) => {
                this.callManager.handleAcceptCall(socket.id, senderId)
            });

            socket.on("end_call", ({participant , from}) => {
                this.callManager.handleEndCall(participant, from)
            })
            // handle disconnect
            socket.on("disconnect", () => {
                // this.callOpManager.handleDisconnect(socket.id);
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

export default CallSocket;
