import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { usePatientContext } from "../hooks/usePatientContext";
import { useAuthContext } from "../hooks/useAuthContext";

const ParamedicChat = () => {
    const { hospital } = usePatientContext();

    const { user, dispatch } = useAuthContext();

    const [message, setMessage] = useState("");
    const [socket, setsocket] = useState(null);
    const [Allmessages, setAllMessages] = useState([]);

    const navigate = useNavigate();
    const navigateToParamedicDashboard = () => {
        navigate("/patient");
    };

    useEffect(() => {
        if (!user || user.role !== "paramedic" || !user?.Token) {
            return;
        }
        const Newsocket = io("http://localhost:4700", {
            auth: { token: user.Token },
        });

        setsocket(Newsocket);

        Newsocket.on("connect", () => {
            console.log("client connecting", user._id);
            Newsocket.emit("SendParamedicID", {
                receiverId: hospital.user_id,
                ParamedicID: user._id,
            });
        });

        Newsocket.on("RecieveMessage", (data) => {
            console.log("Received message from hospital:", data);
            setAllMessages((prevMessages) => [...prevMessages, data]);
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

        setAllMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div className="chat-container">
            <h1 className="chat-header">Messenger</h1>
            <div className="messages">
                {Allmessages.map((msg, index) => (
                    <p key={index} className="message">{msg}</p>
                ))}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    className="messageInput"
                    placeholder="Enter your message"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage} className="sendButton">Send</button>
            </div>

            <button onClick={navigateToParamedicDashboard} className="CloseButton">Close</button>
        </div>
    );
};

export default ParamedicChat;
