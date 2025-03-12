require("dotenv").config();
const express = require("express");
const http = require('http')
const mongoose = require("mongoose");
const cors = require("cors");
const {fleetSocketHandler} = require('./FleetManagement/fleetSocket')

// routes 
const fleetRoutes = require('./FleetManagement/routes/fleet')
const vehicleRoutes = require('./VehicleManagement/routes/vehicle')
const patientRoutes = require('./PatientManagement/routes/patient')
const callOpRoutes = require('./CallOperatorManagement/routes/callOperator')
const resourcesRoutes = require('./ResourcesManagement/routes/resources')
const hospitalRoutes = require('./HospitalManagement/routes/hospital')
const adminRoutes = require('./admin/routes/admin')

const app = express();
app.use(express.json());
app.use(cors());

const fleetServer = http.createServer(app)
fleetSocketHandler(fleetServer)
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

// connect to database 
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Connected to DB and listening on port ${port}!!`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });