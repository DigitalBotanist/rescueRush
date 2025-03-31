import jwt from 'jsonwebtoken';
import { addOtherDetails, updateDetails } from '../PatientManagement/controllers/PatientMangControllers.js';
let connectedClients = {}
let patientData ={}

export const patientSocket = (io) => {

    console.log("inside backend socket function");
    io.use((socket, next) => {
        console.log("inside socket auth");
        const token = socket.handshake.auth?.token || socket.handshake.headers.token  // Get token from client
        console.log("inside socket auth",token);
        if (!token) {
            return next(new Error("Authentication error: Token required"));
        }

        try {
            console.log("token try",token);
            console.log(process.env.SECRET)
            const jwtpayload = jwt.verify(token,process.env.SECRET); // Verify JWT and return the payload of the token
            console.log("token try 2 ",jwtpayload);
            socket.userId = jwtpayload._id; // Attach userId to socket
            console.log("token verified");
            console.log(socket.userId);
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }

        console.log("finished socket auth");
    });
    
    //connection
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        connectedClients[socket.userId] = socket.id; //key -> paramedic ID
        
        socket.on('ClientToSocket', (data) => {
            
            if(data && data.name === 'patientform')
            {
                console.log('data received');
                io.to(socket.id).emit('SocketToClient', patientData[socket.userId]);
                console.log('data sent');
            }
        })
    
     
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
          delete connectedClients[socket.userId]
        });
    
      });
}

export const SetPatientsDetails = (PId, object) => {
    
    patientData[PId] = object
    console.log("setID")
}
