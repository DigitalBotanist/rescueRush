const socketIo = require('socket.io')
const jwt = require('jsonwebtoken')
const User = require('../shared/models/userModel')

const users = {}

const fleetSocketHandler = (server) => {
    const io = socketIo(server) 

    io.use( async (socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.headers.token;
        console.log(token)
        if (!token) {
          return next(new Error("Authentication error: No token provided"));
        }
    
        try {
          const { _id } = jwt.verify(token, process.env.SECRET); // Use your JWT secret
          console.log(_id)
          socket.user = await User.findOne({ _id }).select('_id role')
          next();
        } catch (error) {
          next(new Error("Authentication error: Invalid token"));
        }
      });

    io.on('connection', (socket) => {
        users[socket.id] = socket.user
        console.log(users)
        console.log('A user connected: ', socket.id);
    
        // socket.on('private_message', ({ receiverSocketId, message }) => {
        //   console.log(`Message from ${socket.id} to ${receiverSocketId}: ${message}`);
        //   io.to(receiverSocketId).emit('private_message', { message, senderId: socket.id });
        // });
    
        // socket.on('pair_users', (receiverSocketId) => {
        //   if (users.some((user) => user.socketId === receiverSocketId)) {
        //     console.log(`Pairing user ${socket.id} with ${receiverSocketId}`);
        //     socket.join(receiverSocketId);
        //     socket.emit('message', `You are now paired with ${receiverSocketId}`);
        //   } else {
        //     socket.emit('message', 'User not found');
        //   }
        // });
    
        socket.on('disconnect', () => {
          console.log(`User disconnected: ${socket.id}`);
        });
      });
    
      return io;
}

module.exports = fleetSocketHandler