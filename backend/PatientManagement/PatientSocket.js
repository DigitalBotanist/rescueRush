import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { addOtherDetails, updateDetails } from '../PatientManagement/controllers/PatientMangControllers.js';
let client = null
let patient = null

export const patientSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        socket.on('ClientToSocket', (data) => {
            console.log('data received');
            console.log(data)
            if(data.name === 'patientform')
            {
                client = socket.id;
            }
    
            if(client != null)
            {
                console.log("client", client)
                io.to(client).emit('SocketToClient', patient);
            }
        })
    
      
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
    
      });
}

export const setId = (obj) => {
    patient = obj; 
}
