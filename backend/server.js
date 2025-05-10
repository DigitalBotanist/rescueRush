import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import http from "http";
import path from "path";

import cors from "cors";
import FleetManager from "./FleetManagement/FleetManager.js";
import { Server } from "socket.io";
import { patientSocket } from "./PatientManagement/PatientSocket.js";
import ChatSocket from "./PatientManagement/ChatSocket.js";

// routes
import fleetRoutes from "./FleetManagement/routes/fleet.js";
import vehicleRoutes from "./VehicleManagement/routes/vehicle.js";
import patientRoutes from "./PatientManagement/routes/patient.js";
import callOpRoutes from "./CallOperatorManagement/routes/callOperator.js";
import resourcesRoutes from "./ResourcesManagement/routes/resources.js";
import hospitalRoutes from "./HospitalManagement/routes/hospital.js";
import adminRoutes from "./admin/routes/admin.js";
import requireAuth from "./shared/middleware/requireAuth.js";
import CallOpManager from "./CallOperatorManagement/CallOpManager.js";

const rootDir = path.resolve(process.cwd());

const app = express();
app.use(express.json());
app.use(cors());

// fleet socket server
const fleetServer = http.createServer(app);
const fleetManager = new FleetManager(fleetServer);
fleetServer.listen(4500, () => {
    console.log("fleetServer started at 4500");
});

//callop socket 
const callopServer = http.createServer(app)
const callopManager = new CallOpManager(callopServer)
callopServer.listen(4400, () => {
    console.log("callop socket started at 4400")
})

//Patient Management socket server
const PatientServer = http.createServer(app)
PatientServer.listen(4600,() => {
    console.log("Server ruuning in port 4600")
})
const io = new Server(PatientServer, {
    cors: {
        origin: "*"
    }, //modified cors
})
patientSocket(io)
console.log("checking function io")

//chat scoket server

const ChatServer = http.createServer(app)
ChatServer.listen(4700,() => {
    console.log("Chat Server ruuning in port 4700")
})
const Chatio = new Server(ChatServer, {
    cors: {
        origin: "http://localhost:5173"
    }, //modified ++
})

const chatsocket = new ChatSocket(Chatio)


// print a message when request is received
app.use((req, res, next) => {
    console.log(req.path, req.method, "got request");
    next();
});

// routing
app.use("/api/fleet", fleetRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/call_op", callOpRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/uploads/:filename", (req, res) => {
    const { filename } = req.params;

    // Construct the file path based on the filename
    const filePath = path.join(rootDir, "uploads", filename);

    // Send the file if it exists
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            return res.status(404).json({ error: "File not found" });
        }
    });
});

// connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Connected to DB and listening on port ${port}!!`);
            // Todo: bad code
            fleetManager.setAllVehiclesOffline();
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

console.log("connecting to database");

//Start patient management server for socket
