import { createContext, useContext, useReducer } from "react";

    export const DetailHospitalContext = createContext() //context creation

    export const detailsReducer =(state,action) => {
        switch(action.type){
            case 'SET_DETAILS':
                return{
                    details:action.payload
                }
            case 'CREATE_DETAILS':
                return{
                    details: [action.payload,...state.details]
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
      const [state,dispatch] = useReducer(detailsReducer,{
        details :null
      })



      return (
        <DetailHospitalContext.Provider value={{ ...state, dispatch }}>
            {children}
        </DetailHospitalContext.Provider>
    )
}