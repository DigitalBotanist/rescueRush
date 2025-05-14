import User from "../shared/models/userModel.js";
import Vehicle from "../VehicleManagement/models/vehicleModel.js";
import CallSocket from "./CallSocket.js";

class CallManager {
    constructor(server) {
        console.log("call manager started");
        if (CallManager.instance) {
            return CallManager.instance;
        }
        CallManager.instance = this;

        this.callSocket = new CallSocket(server, this);

        // active users
        this.socketToUser = new Map(); // socketId -> userId
        this.userToSocket = new Map(); // userId -> socketId
    }

    // get fleetmanagement instance
    static getInstance() {
        if (CallManager.instance) {
            return CallManager.instance;
        }
        throw new Error("CallOpManager is not intialized yet");
    }

    async addUser(socketId, userId) {
        try {
            // get user data
            const user = await User.findById(userId);

            // set callop data
            this.socketToUser.set(socketId.toString(), userId);
            this.userToSocket.set(userId.toString(), socketId);

            this.callSocket.sendMessage(socketId, "call_manager_connected", ""); // send confirmation message
            console.log("new active call user: ", user._id);
        } catch (error) {
            this.callSocket.sendMessage(
                socketId,
                "call_manager_connection_error",
                error.message
            ); // send error message
        }
    }

    async handleCallRequest(socketId, receiverId, peerId) {
        try {
            // get sender id
            const senderId = this.getUserId(socketId);

            // check if the receiverId exist
            const receiverSocket = this.getSocketId(receiverId);

            // get sender user data
            const sender = await User.findById(senderId);
            if (!sender) {
                throw new Error("sender is not found in database");
            }

            this.callSocket.sendMessage(receiverSocket, "incoming_call", {
                sender,
                peerId,
            });
        } catch (error) {
            this.callSocket.sendMessage(
                socketId,
                "call_request_error",
                error.message
            ); // send error message
        }
    }

    handleAcceptCall(socketId, senderId, peerId) {
        try {
            // get receiver id
            const receiverId = this.getUserId(socketId);

            // get sender socketid
            const senderSocket = this.getSocketId(senderId);

            this.callSocket.sendMessage(senderSocket, "call_accepted", {
                receiverId,
                peerId,
            });
        } catch (error) {
            this.callSocket.sendMessage(
                socketId,
                "accept_call_error",
                error.message
            ); // send error message
        }
    }

    handleRejectCall(socketId, senderId) {
        try {
            // get receiver id
            const receiverId = this.getUserId(socketId);

            // get sender socketid
            const senderSocket = this.getSocketId(senderId);

            this.callSocket.sendMessage(senderSocket, "call_rejected", {
                receiverId
            });
        } catch (error) {
            this.callSocket.sendMessage(
                socketId,
                "reject_call_error",
                error.message
            ); // send error message
        }
    }

    handleEndCall(participantId, from) {
        try {
            const participantSocket = this.getSocketId(participantId)

            this.callSocket.sendMessage(participantSocket, "call_ended", from)
        } catch (error) {
            this.callSocket.sendMessage(
                socketId,
                "end_call_error",
                error.message
            ); // send error message
        }
    }

    // registerPeer(socketId, type, receiverId, peerId) {
    //     // type: incoming type, if coming from vehicle -> type = vehicle
    //     try {
    //         if (type === "vehicle") {
    //             const vehicle = this.getVehicleFromSocketId(
    //                 receiverId,
    //                 socketId
    //             );
    //             console.log(vehicle);
    //             vehicle.peerId = peerId;

    //             const callop = this.getActiveCallop(receiverId);
    //             this.callOpSocket.sendMessage(
    //                 callop.socketId,
    //                 "register_peer",
    //                 { vehicle, peerId }
    //             );
    //         } else {
    //             // todo: if type is call op
    //             this.callOpSocket.sendMessage(
    //                 socketId,
    //                 "register_peer",
    //                 peerId
    //             );
    //         }
    //     } catch (error) {
    //         this.callOpSocket.sendMessage(
    //             socketId,
    //             "register_peer_error",
    //             error.message
    //         );
    //     }
    // }

    // assignPeer(socketId, type, receiverId, peerId) {
    //     // type: incoming type, if coming from vehicle -> type = vehicle
    //     try {
    //         console.log("receiver id", receiverId);
    //         if (type == "callop") {
    //             const callopId = this.getCallopIdFromSocketId(socketId);
    //             const vehicle = this.getVehicleFromVehicleId(
    //                 callopId,
    //                 receiverId
    //             );

    //             console.log("peerid", peerId);
    //             this.callOpSocket.sendMessage(
    //                 vehicle.socketId,
    //                 "assign_peer",
    //                 peerId
    //             );
    //         } else {
    //             //todo: handle if the type is callop
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //         this.callOpSocket.sendMessage(
    //             socketId,
    //             "assign_peer_error",
    //             error.message
    //         );
    //     }
    // }

    handleDisconnect(socketId) {
        // handle disconnect
        this.removeBySocket(socketId);
        console.log("disconnect");
    }

    getUserId(socketId) {
        if (!socketId) {
            throw new Error("socketId must be provided.");
        }

        const userId = this.socketToUser.get(socketId.toString());
        if (userId === undefined) {
            throw new Error(`User not found for socketId: ${socketId}`);
        }
        return userId;
    }

    getSocketId(userId) {
        if (!userId) {
            throw new Error("userId must be provided.");
        }

        const socketId = this.userToSocket.get(userId.toString());
        if (socketId === undefined) {
            throw new Error(`Socket not found for userId: ${userId}`);
        }
        return socketId;
    }

    removeBySocket(socketId) {
        if (!socketId) {
            console.log("socketId must be provided.");
        }

        const userId = this.socketToUser.get(socketId.toString());
        if (!userId) {
            console.warn(`No user found for socketId: ${socketId}`);
            return false;
        }

        this.socketToUser.delete(socketId.toString());
        this.userToSocket.delete(userId.toString());
        return true;
    }

    removeByUser(userId) {
        if (!userId) {
            console.log("userId must be provided.");
        }

        const socketId = this.userToSocket.get(userId.toString());
        if (!socketId) {
            console.warn(`No socket found for userId: ${userId}`);
            return false;
        }

        this.userToSocket.delete(userId.toString());
        this.socketToUser.delete(socketId.toString());
        return true;
    }
}

export default CallManager;
