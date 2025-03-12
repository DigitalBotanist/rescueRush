const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../shared/models/userModel");
const Vehicle = require("../VehicleManagement/models/vehicleModel");
const Emergency = require('../shared/models/emergencyModel')
const Patient = require('../shared/models/patientModel')
// const { handleAcceptEmergency } = require('../FleetManagement/controllers/emergency')

const activeVehicles = {};
const vehicleSocketMap = {};
let io;

const fleetSocketHandler = (server) => {
    io = socketIo(server);

    io.use(async (socket, next) => {
        const token =
            socket.handshake.auth?.token || socket.handshake.headers.token;
        console.log(token);
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const { _id } = jwt.verify(token, process.env.SECRET); // Use your JWT secret
            console.log(_id);
            socket.user = await User.findOne({ _id }).select("_id role");
            socket.vehicle = await Vehicle.findOne({ driver: _id });
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        // save current vehicle info 
        activeVehicles[socket.id] = socket.vehicle.id;
        vehicleSocketMap[socket.vehicle.id] = {
            socketId: socket.id, 
            vehicle: socket.vehicle 
        };
        console.log("A vehicle connected: ", socket.id);

        // handle vehicle accept an emergency request 
        socket.on('accept_request', (emergencyId) => {
            const vehicleId = activeVehicles[socket.id]
            try {
                handleAcceptEmergency(emergencyId, vehicleId)
            } catch(error) {
                socket.emit('accept_request_error', {error: error.message})
            }
        })

        // handle disconnect 
        socket.on("disconnect", () => {
            
            delete activeVehicles[socket.id]
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    // get the socket io instance 
    if (!io) {
        throw new Error("socket.io has not been intialized");
    }
    return io;
};

const handleAcceptEmergency = async (emergencyId, vehicleId) => {
    // handle accept emergency message from the socket 

    // find emergency with the emergency Id
    const emergency = await Emergency.findOne({ _id: emergencyId}).populate([
        { path: 'patients', model: 'Patient', select: 'name age emergencyType details vehicle'}
    ])

    // if a patient needs a vehicle assign the vehicle 
    for (const patient of emergency.patients) {
        if (patient.driver == null) {
            const updatedEmergency = await Patient.updateOne(
                { _id: patient._id},
                { $set: {vehicle: vehicleId}}
            )
            //todo: send the update request to assigned vehicle 

            break;
        }
    }


        
    //todo: if all patients have vehicles send updates to other vehicles 
}


const sendEmergencyRequest = (vehicleId, emergency) => {
    try {
        console.log('vehi map', vehicleSocketMap)
        const socketId = vehicleSocketMap[vehicleId].socketId
        const io = getIo(); 
        io.to(socketId).emit("new_request", {emergency});
        console.log(`Message sent to ${socketId}: ${emergency}`);
    } catch (error) {
        console.error("Error sending message:", error);
    }
};


module.exports = {
    fleetSocketHandler,
    getIo,
    sendEmergencyRequest,
};
