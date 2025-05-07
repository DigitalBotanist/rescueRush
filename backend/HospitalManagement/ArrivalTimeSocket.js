const express= require("exprss");
const http = require("http")
const socketIo = require("socket.io")

const app=express()
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "*", 
    },
  });

  io.on("connection",(socket)=>{        //client connects via socket
    console.log("A user connected:", socket.id);

    setInterval(()=>{
        const arrivalTime={
            estimatedTime : new Date().toLocaleTimeString,
            distanceLeft : Math.floor(Math.random() * 10) + " km"
        };
        socket.emit("arrivalUpdate", arrivalData);          //ends data only to the connected user
    },5000);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
  });

  server.listen(4000, () => {
    console.log("Server running on port 4000");
  });