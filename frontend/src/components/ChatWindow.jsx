import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from 'socket.io-client';

// Move socket outside component to avoid multiple connections
const socket = io('http://localhost:4000');

function ChatWindow() {
    const currentDate = new Date().toLocaleDateString();
    const { user } = useAuthContext();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [recipientId, setRecipientId] = useState(''); 

    useEffect(() => {
        if (!user) return;
        
        // Use user._id or whatever your user ID field is called
        socket.emit('login', user._id);

        socket.on('privateMessage', ({ from, message }) => {
            setMessages(prev => [...prev, { from, message, isMe: false }]);
        });

        return () => {
            socket.off('privateMessage');
        };
    }, [user]); // Depend on user instead of undefined currentUserId

    const sendPrivateMessage = () => {
        if (message.trim() && recipientId) {
            socket.emit('privateMessage', {
                to: recipientId,
                message: message
            });
            // Add message to local state
            setMessages(prev => [...prev, { 
                from: user._id, 
                message, 
                isMe: true 
            }]);
            setMessage('');
        }
    };

    return (
        <div>
            <div className='flex flex-row'>
                <div className='h-screen bg-[#EC221F] p-10 w-80 flex flex-col space-y-8 '>
                    <h1 className='text-white text-2xl'>{user.firstName} {user.lastName}</h1>
                    <Link to="/hospital/HospitalStaffDashBoard"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Doctor Details</h3></Link>
                    <Link to="/hospital/AmbulanceArrivalTime"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Ambulance Arrival Time</h3></Link>
                    <Link to="/hospital/HospitalDetail"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Hospital details</h3></Link>
                    <Link to="/hospital/Report"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Report</h3></Link>
                    <Link to="/hospital/ChatWindow"><h3 className='text-white hover:bg-[#B61E1E] hover:rounded-xl p-3'>Chat Window</h3></Link>
                </div>

                <div className="flex-1 p-4">
                    <div className='flex flex-row justify-between mb-4'>
                        <h1 className='text-2xl'>Chat Window</h1>
                        <h1 className='text-2xl'>{currentDate}</h1>
                    </div>

                    {/* Chat UI */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Recipient ID"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            className="border p-2 mr-2"
                        />
                    </div>

                    {/* Message Display */}
                    <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`mb-2 p-2 rounded-lg ${msg.isMe ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`}
                                style={{ maxWidth: '70%' }}
                            >
                                <strong>{msg.from}:</strong> {msg.message}
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendPrivateMessage()}
                            placeholder="Type your message..."
                            className="flex-1 border p-2 rounded-l-lg"
                        />
                        <button 
                            onClick={sendPrivateMessage}
                            className="bg-[#EC221F] text-white px-4 py-2 rounded-r-lg"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;