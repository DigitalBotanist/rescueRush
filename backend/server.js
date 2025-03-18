
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose';
import http from 'http'
import cors from 'cors'
import { serve, setup } from 'swagger-ui-express';
import FleetManager from './FleetManagement/FleetManager.js';
import YAML from 'yamljs';
import path from 'path';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from "url";


// routes 
import fleetRoutes from './FleetManagement/routes/fleet.js'
import vehicleRoutes from './VehicleManagement/routes/vehicle.js'
import patientRoutes from './PatientManagement/routes/patient.js'
import callOpRoutes from './CallOperatorManagement/routes/callOperator.js'
import resourcesRoutes from './ResourcesManagement/routes/resources.js'
import hospitalRoutes from './HospitalManagement/routes/hospital.js'
import adminRoutes from './admin/routes/admin.js'

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger YAML files
const swaggerDirectory = path.join(__dirname, 'swagger');
const swaggerFiles = readdirSync(swaggerDirectory);



const swaggerDocs = swaggerFiles.map((file) => {
    const filePath = path.join(swaggerDirectory, file);
    const fileContent = readFileSync(filePath, 'utf8');
    return YAML.parse(fileContent);
  });

  const combinedSwaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'MERN API',
      version: '1.0.0',
      description: 'API documentation for the MERN project',
    },
    paths: {},
    components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
  };

  swaggerDocs.forEach((doc) => {
    if (doc.paths) Object.assign(combinedSwaggerSpec.paths, doc.paths);
    if (doc.components) Object.assign(combinedSwaggerSpec.components, doc.components);
  });

// fleet socket server 
const fleetServer = http.createServer(app)
const fleetManager = new FleetManager(fleetServer)
fleetServer.listen(4500, () => {
    console.log("fleetServer started at 4500")
})

// print a message when request is received
app.use((req, res, next) => {
    console.log(req.path, req.method, "got request")
    next()
})

// swagger documenting
app.use("/api-docs", serve, setup(combinedSwaggerSpec));

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
            // Todo: bad code 
            fleetManager.setAllVehiclesOffline()
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });