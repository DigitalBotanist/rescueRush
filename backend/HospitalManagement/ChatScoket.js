const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"]
    },
});

const users = {}; // Store user connections

io.on('connection', (socket) => {
    console.log("New Connection ", socket.id);

    socket.on('login', (userId) => {
        console.log(`User ${userId} connected`);
        users[userId] = socket.id;
        socket.userId = userId;
    });

    socket.on('privateMessage', ({ to, message }) => {
        const senderId = socket.userId;
        const receiverSocketId = users[to];

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('privateMessage', {
                from: senderId,
                message: message
            });
            console.log(`Private message from ${senderId} to ${to}`);
        } else {
            console.log(`User ${to} is offline`);
            socket.emit('error', `User ${to} is offline`);
        }
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            console.log(`User ${socket.userId} disconnected`);
            delete users[socket.userId];
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});