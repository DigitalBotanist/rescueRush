import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { usePatientContext } from "../hooks/usePatientContext";
import { useAuthContext } from "../hooks/useAuthContext";

const ParamedicChat = () => {
    const { hospital } = usePatientContext();

    const {user , dispatch } = useAuthContext();

    const [message, setMessage] = useState("");
    const [socket, setsocket] = useState(null);
    const [Allmessages, setAllMessages] = useState([]);

    const navigate = useNavigate();
    const navigateToParamedicDashboard = () => {
        navigate("/patient");
    };

    useEffect(() => {
        if (!user || user.role !== "paramedic" || !user?.Token) 
        {   
            return;
        }
        const Newsocket = io("http://localhost:4700", {
            auth: { token: user.Token },
        });

        setsocket(Newsocket);

        console.log("Reciever.id : ",hospital.user_id)
        
        Newsocket.on("connect", () => {
            console.log("client connecting", user._id);
            Newsocket.emit("SendParamedicID", {
                receiverId: hospital.user_id,
                ParamedicID: user._id,
            });
        });

        Newsocket.on("RecieveMessage", (data) => {
            console.log("Received message from hospital:", data);
            setAllMessages((prevMessages) => [...prevMessages, {text : data, isSender : false}]);
        });

        Newsocket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            Newsocket.disconnect();
        };
    }, [user]);

    const sendMessage = () => {
        socket.emit("SendMessage", {
            receiverId: hospital.user_id,
            message: message,
        });

        setAllMessages((prevMessages) => [...prevMessages,{text : message, isSender : true} ]);
        setMessage(""); // Clear input
    };

    return  (
        <div className="chat-container">
            <h1 className="chat-header">Messenger</h1>
            <div className="messages">
                {Allmessages.map((msg, index) => (
                    <p key={index} className={`message ${msg.isSender ? "sent" : "received"}`}>
                        {msg.text}
                    </p>
                ))}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    className="messageInput"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage} className="sendButton">Send</button>
            </div>

            <button onClick={navigateToParamedicDashboard} className="CloseButton">Close</button>
        </div>
    );
};

export default ParamedicChat;
