import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { addOtherDetails, updateDetails, id } from '../PatientManagement/controllers/PatientMangControllers.js';
let client = null

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', (data) => {
        console.log('data received');

        if(data.name == 'patientform')
        {
            client = socket.id;
        }

        if(client != null)
        {
            io.to(client).emit('customMessage', {id:id});
        }
    })

  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

  });
  
  
    
