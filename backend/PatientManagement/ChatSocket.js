 import jwt from 'jsonwebtoken';

let ConnectedClients = {}

class ChatSocket
{
    constructor(io)
    {
        this.io = io
        this.setupMiddleware();
        this.SocketFunctions();
    }

    setupMiddleware()
{
    this.io.use((socket, next) => {
        
        const token = socket.handshake.auth?.token || socket.handshake.headers.token  // Get token from client
        console.log("Client JWT Token:", token);
        if (!token) {
            return next(new Error("Authentication error: Token required"));
        }

        try {
            const jwtpayload = jwt.verify(token,process.env.SECRET); // Verify JWT and return the payload of the token
            socket.userId = jwtpayload._id; // Attach userId to socket
            console.log("Socket Auth finieshed : ",socket.userId );
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }

        
    })

}

SocketFunctions()
{
    console.log("Inside socket functions");
    this.io.on('connection', (socket) => {
        console.log('A user connected to the Chat socket :', socket.userId);
        ConnectedClients[socket.userId] = socket.id; //key -> paramedic ID or HospitalStaff ID

        socket.on('SendParamedicID',(data) =>{
            
            console.log("Reciver id : ",data.receiverId)
            const targetClient = ConnectedClients[data.receiverId]
            console.log("target client",targetClient)
            if(targetClient)
                {
                    this.io.to(targetClient).emit('RecieveParamedicID', data.ParamedicID);
                }
                else{
                    throw new Error("Id not sent");
                }
        })

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
          console.log('User disconnected from chat socket:', socket.id);
          delete ConnectedClients[socket.userId]
        });
    
      });
}
}


export default ChatSocket;