import jwt from 'jsonwebtoken';

let ConnectedClients = {}

class ChatSocket
{
    constructor(io)
    {
        this.io = io
        setupMiddleware()
        SocketFunctions()
    }
}

setupMiddleware()
{
    this.io.use((socket, next) => {
        
        const token = socket.handshake.auth?.token || socket.handshake.headers.token  // Get token from client
        if (!token) {
            return next(new Error("Authentication error: Token required"));
        }

        try {
            const jwtpayload = jwt.verify(token,process.env.SECRET); // Verify JWT and return the payload of the token
            socket.userId = jwtpayload._id; // Attach userId to socket
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }

        
    })

}

SocketFunctions()
{
    this.io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        ConnectedClients[socket.userId] = socket.id; //key -> paramedic ID or HospitalStaff ID

        
        socket.on('SendMessage', (data) => {

            const targetClient = ConnectedClients[data.receiverId]

            if(targetClient)
            {
                this.io.to(targetClient).emit('RecieveMessage', data.message);
            }
            else{
                throw new Error("Reciver not found");
            }
        }) 
    
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
          delete ConnectedClients[socket.userId]
        });
    
      });
}