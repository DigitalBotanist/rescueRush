import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { usePatientContext } from "../hooks/usePatientContext";

const  ParamedicChat = () => {

    const { hospital } = usePatientContext()

    const user = JSON.parse(localStorage.getItem('user'))
    const token = user.Token

    const [message, setMessage] = useState('');
    const [socket, setsocket] = useState(null)
    const [Allmessages, setAllMessages] = useState([]);

    console.log("CHAT SOCKET")

    const navigate = useNavigate();
    const navigateToParamedicDashboard = () => {
    navigate('/patient');
  };

    useEffect(() => {

        console.log("frontend chat socket connecting using use effect")
        const Newsocket = io('http://localhost:4700', {
          auth: { token: token }
        });

        setsocket(Newsocket)
      
        Newsocket.on('connect', () => {
          console.log("client connecting",user._id)
          Newsocket.emit('SendParamedicID', { receiverId:hospital.user_id, ParamedicID : user._id });
        });



        Newsocket.on('RecieveMessage', (data) => {
          console.log('Received message from hospital:', data);
          setAllMessages((prevMessages) => [...prevMessages, data]);
         
        });
      
        Newsocket.on('disconnect', () => {
          console.log('Disconnected from server');
        });
        
        return () => {
          Newsocket.disconnect();
        };
    
      }, [user]);
      
      const  sendMessage = () =>
        {
            socket.emit('SendMessage',({receiverId:hospital.user_id, message:message}))
        }

    return (
            <div>
            <h1>Messenger</h1>
            <div className="messages">
              {Allmessages.map((msg, index) => (
                <p key={index}><strong>{msg}</strong></p>
              ))}
            </div>

            <input type="text" className="messageInput" placeholder="Enter your message" onChange={(e)=> setMessage(e.target.value)}></input>
            <button onClick={sendMessage} className="sendButton">Send</button>
            <button onClick={navigateToParamedicDashboard} className="CloseButton">close</button>
            </div>
        );
}

export default ParamedicChat;