import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { addOtherDetails, updateDetails } from '../PatientManagement/controllers/PatientMangControllers.js';
let connectedClients = {}
let patientData ={}

export const patientSocket = (io) => {

    //Auth
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.headers.token  // Get token from client
        if (!token) {
            return next(new Error("Authentication error: Token required"));
        }

        try {
            const jwtpayload = jwt.verify(token,process.env.SECRET); // Verify JWT and return the payload of the token
            socket.userId = jwtpayload._id; // Attach userId to socket
            connectedClients[socket.userId] = socket.id; //key -> paramedic ID
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });
    
    //connection
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
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
          delete connectedClients[socket.id]
        });
    
      });
}

export const SetPatientsDetails = (PId, object) => {
    
    patientData[PId] = object
    console.log("setID")
}
