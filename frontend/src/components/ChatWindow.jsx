import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { DetailHospitalContext } from '../context/DetailHospitalContext';
import { Menu, X, Send } from 'lucide-react';

function ChatWindow() {
    const currentDate = new Date().toLocaleDateString();
    const { user } = useAuthContext();
    const [message, setMessage] = useState("");
    const { socket, setSocket, paramedicId, setParamedicId, Allmessages, setAllMessages } = useContext(DetailHospitalContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) {
            const newSocket = io('your-socket-server-url'); 
            setSocket(newSocket);

            newSocket.on('ReceiveMessage', (data) => {
                setAllMessages((prevMessages) => [...prevMessages, data.message]);
            });

            return () => newSocket.disconnect();
        }
    }, [socket, setSocket, setAllMessages]);

    const sendMessage = () => {
        if (!message.trim()) return;
        socket.emit("SendMessage", {
            receiverId: paramedicId,
            message: message
        });
        setAllMessages((prevMessages) => [...prevMessages, message]);
        setMessage("");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-red-600 text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} p-4`}>
                <div className="flex items-center justify-between mb-6">
                    {isSidebarOpen && <h1 className="text-xl font-semibold">{user.firstName} {user.lastName}</h1>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-red-700">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <nav className="flex flex-col space-y-2">
                    <Link to="/hospital/HospitalStaffDashBoard" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Doctor Details</span>}
                        {!isSidebarOpen && <span className="text-xl">📋</span>}
                    </Link>
                    
                    <Link to="/hospital/HospitalDetail" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Hospital Details</span>}
                        {!isSidebarOpen && <span className="text-xl">🏥</span>}
                    </Link>
                    <Link to="/hospital/Report" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Report</span>}
                        {!isSidebarOpen && <span className="text-xl">📊</span>}
                    </Link>
                    <Link to="/hospital/ChatWindow" className="flex items-center py-2 px-4 rounded-lg hover:bg-red-700 transition">
                        {isSidebarOpen && <span>Chat Window</span>}
                        {!isSidebarOpen && <span className="text-xl">💬</span>}
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Messenger</h1>
                    <span className="text-gray-600">{currentDate}</span>
                </div>

                {/* Chat Window */}
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
                    <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg bg-gray-50 p-4">
                        {Allmessages.length > 0 ? (
                            Allmessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 p-3 rounded-lg max-w-[70%] ${
                                        index % 2 === 0 ? 'bg-red-100 ml-auto text-right' : 'bg-gray-200'
                                    }`}
                                >
                                    <p className="text-sm text-gray-800 break-words">{msg}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-4">No messages yet.</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
                            disabled={!message.trim()}
                        >
                            <Send size={18} className="mr-2" />
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;