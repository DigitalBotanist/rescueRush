import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { DetailHospitalContext } from '../context/DetailHospitalContext';


function ChatWindow() {
    const currentDate = new Date().toLocaleDateString();
    const { user } = useAuthContext();
    const [message, setMessage] = useState("");
    const {socket,setsocket,paramedicId,setParamedicId,Allmessages, setAllMessages}=useContext(DetailHospitalContext)
    
    

    const sendMessage=()=>{
        console.log("Hello")
        console.log(paramedicId)
        socket.emit("SendMessage",{
            receiverId: paramedicId,
            message: message
        });
        setAllMessages((prevMessages) => [...prevMessages, {text : message, isSender : true}]);
         setMessage(""); // Clear input
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

                <div className="w-1/2 bg-white rounded-lg shadow-md p-5 border border-black mx-auto mt-12">
                    <h1 className="text-center text-3xl font-bold my-5">Messenger</h1>

                    <div className="h-96 overflow-y-auto mb-4 border border-gray-300 p-4 rounded-md bg-gray-100">
                        {Allmessages.map((msg, index) => (
                         <p key={index} className={`mb-2 p-2 break-words rounded-md ${msg.isSender
                    ? "bg-green-200 text-right self-end max-w-[70%] ml-auto" 
                    : "bg-gray-300 text-left self-start max-w-[70%] mr-auto"}`}
                                >
                                    {msg.text}
                                </p>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-md outline-none"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                        Send
                        </button>
                    </div>
</div>


            </div>
        </div>
       
    );
}

export default ChatWindow;