import { createContext, useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client"
import { useAuthContext } from "../hooks/useAuthContext";


export const VehicleContext = createContext()

export const vehicleReducer = (state, action) => {
    switch(action.type) {
        case 'SET_VIN':
            console.log('SET_VIN', action.payload.vin)
            return {...state, vin: action.payload.vin}
        case 'SET_LOCATION': 
            console.log(action.payload.location)
            return {...state, location: action.payload.location} 
    }
}

export const VehicleContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const { user } = useAuthContext()
    const [state, dispatch] = useReducer(vehicleReducer, {
        vin: null, 
        location: null,
        currentEmergency: null
    })

    // get 'vin' from localhost if exists
    useEffect(() => {
        const vin = JSON.parse(localStorage.getItem('vin'))

        if (vin) {
            dispatch({type: 'SET_VIN', payload: { vin }})
        }
    }, [])

    // make a socket connection with fleet management
    useEffect(() => {
        if (!user || user.role !== 'driver' || !user?.token) return;

        const newSocket = io("ws://localhost:4500", {
            auth: {
                token: user.token,
            },
        })
        
        // listeners
        newSocket.on('new_request', () => {
            console.log("new request")
        })
        newSocket.on('fleet_connected', () => {
            console.log("new conn")
        })

        setSocket(newSocket)

        console.log("socket is created: ", newSocket)
    }, [user])

    return (
        <VehicleContext.Provider value={{...state, dispatch, socket, setSocket}}>
            {children}
        </VehicleContext.Provider>
    ) 
}