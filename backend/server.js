
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose';
import http from 'http'
import cors from 'cors'
import FleetManager from './FleetManagement/FleetManager.js';
import userRouter from './shared/routes/user.js';

// routes 
import fleetRoutes from './FleetManagement/routes/fleet.js'
import vehicleRoutes from './VehicleManagement/routes/vehicle.js'
import patientRoutes from './PatientManagement/routes/patient.js'
import callOpRoutes from './CallOperatorManagement/routes/callOperator.js'
//import resourcesRoutes from './ResourcesManagement/routes/resources.js'
import hospitalRoutes from './HospitalManagement/routes/hospital.js'
import adminRoutes from './admin/routes/admin.js'


const app = express();
app.use(express.json());
app.use(cors());

// fleet socket server 
const fleetServer = http.createServer(app)
const fleetManager = new FleetManager(fleetServer)
fleetServer.listen(4500, () => {
    console.log("fleetServer started at 5500")
})

// print a message when request is received
app.use((req, res, next) => {
    console.log(req.path, req.method, "got request")
    next()
})

// routing
app.use('/api/fleet', fleetRoutes)
app.use('/api/vehicle', vehicleRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/call_op', callOpRoutes)
app.use('/api/resources', resourcesRoutes)
app.use('/api/hospital', hospitalRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRouter);

// connect to database 
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Connected to DB and listening on port ${port}!!`);
            // Todo: bad code 
            fleetManager.setAllVehiclesOffline()
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });