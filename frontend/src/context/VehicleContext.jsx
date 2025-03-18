import { createContext, useEffect, useReducer } from "react";


export const VehicleContext = createContext()

export const vehicleReducer = (state, action) => {
    switch(action.type) {
        case 'SET_VIN':
            return {...state, vin: action.payload.vin}
        case 'SET_LOCATION': 
            return {...state, location: action.payload.location} 
    }
}

export const VehicleContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(vehicleReducer, {
        vin: null, 
        location: null,
        currentEmergency: null
    })

    useEffect(() => {
        const vin = JSON.parse(localStorage.getItem('vin'))

        if (vin) {
            dispatch({type: 'SET_VIN', payload: { vin }})
        }
    }, [])

    return (
        <VehicleContext.Provider value={{...state, dispatch}}>
            {children}
        </VehicleContext.Provider>
    ) 
}