const {getIo, vehicleSocketMap} = require('./fleetSocket')

const sendEmergencyRequest = (vehicleId, emergency) => {
    try {
        const socketId = vehicleSocketMap[vehicleId].socketId
        const io = getIo(); 
        io.to(socketId).emit("new_request", {emergency});
        console.log(`Message sent to ${socketId}: ${emergency}`);
    } catch (error) {
        console.error("Error sending message:", error);
    }
};


module.exports = {
    sendEmergencyRequest,
};