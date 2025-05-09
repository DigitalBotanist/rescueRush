import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

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
        const {socket,setSocket}=useState(null)
        const [patientDetails, setPatientDetails] = useState(null);
        const [state,dispatch] = useReducer(detailsReducer,{
        details :null
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
        if (!user || user.role !== "hospital_staff" || !user.token) return;

            //make new Socket
            const newSocket =io("ws://localhost:4600",{
                auth:{
                    token:user.token        //socket.handshake.auth.token= user.token
                }
            });

            //listner
            socket.on("connect",()=>{
                console.log("Hospital Connceting.....")
                socket.emit('SendMessage',{name : 'patientform'})
            });

            socket.on('SocketToClient', (data) => {
                console.log('Received patient details:', data);
                setPatientDetails(data);
                dispatch({ type: "SET_PAT", payload: data });
            });

            //socket Disconnected 
            socket.on('disconnect', () => {
                console.log('Disconnected from server');
            });
    
    },[user]);
    


      return (
        <DetailHospitalContext.Provider value={{ ...state, dispatch,socket,setSocket }}>
            {children}
        </DetailHospitalContext.Provider>
    )
}