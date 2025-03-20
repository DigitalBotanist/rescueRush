const express = require('express')
const http = require('http')
const socket = require('socket.io')
const {addOtherDetails,updateDetails,id} = require('../PatientManagement/controllers/PatientMangControllers')


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
  
  
    
