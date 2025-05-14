import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { io } from "socket.io-client";


    export const DetailHospitalContext = createContext() //context creation

    export const detailsReducer =(state,action) => {
        switch(action.type){
            case 'SET_DETAILS':
                return{
                    details:action.payload
                }
            case 'CREATE_DETAILS':
                return{
                    details: action.payload
                }
            case 'DELETE_DETAILS':
                return{
                    details: state.details.filter((d)=>d._id !== action.payload._id)
                }
           
            default:
                return state    

        }

    }

    export const DetailHospitalContextProvider = ({children}) =>{
        const {user} = useAuthContext()
        const[socket,setsocket]=useState(null)
        const [paramedicId,setParamedicId]=useState(null)   //Store paramedic ID
        const [Allmessages, setAllMessages] = useState([]);
        const [state,dispatch] = useReducer(detailsReducer,{
      })

      useEffect(() => {
        const fetchHospitalDetails = async () => {
            if (!user || user.role !== "hospital_staff" || !user.token) return;
    
            try {

                const response = await fetch(`/api/hospital/hospital_details`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: user._id,
                    }),
                });
    
                const json = await response.json();

                if (!response.ok) {
                    console.log("Error:", json) 
                    return 
                }
    
                console.log(json);
                dispatch({type: "SET_DETAILS", payload: json})
            } catch (error) {
                console.error("Error fetching hospital details:", error);
            }
        };    
        fetchHospitalDetails();
    }, [user]);

    useEffect(()=>{
        const chatWithParamedic = async () => {
            if (!user || user.role !== "hospital_staff" || !user.token) return;

            console.log("Entered hospital useffect")

            const Newsocket = io("http://localhost:4700", {
                auth: { token: user.token },
            });

             console.log("After connecting")
            setsocket(Newsocket);
             console.log("State updated")

            Newsocket.on("connect", () => {
                console.log("Hospital staff connected to chat");
            });


            Newsocket.on("RecieveParamedicID", (paramedicId) => {
                console.log("Received paramedic ID:", paramedicId);
                setParamedicId(paramedicId); // store in state
                
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
        }

        chatWithParamedic();
    },[user])

    


      return (
        <DetailHospitalContext.Provider value={{ 
            ...state,
             dispatch,
             socket,       //Acess the current state
             setsocket,     //Updare the state
             paramedicId,
             setParamedicId,
             setAllMessages,
             Allmessages}}>
            {children}
        </DetailHospitalContext.Provider>
    )
}