import { createContext, useContext, useEffect, useReducer } from "react";
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


      return (
        <DetailHospitalContext.Provider value={{ ...state, dispatch }}>
            {children}
        </DetailHospitalContext.Provider>
    )
}