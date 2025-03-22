import { createContext, useContext, useEffect, useReducer } from "react";

export const PatientContext = createContext();

export const patientReducer = (state, action) => {
    switch (action.type) {
        case "SET_VIN":
            console.log("SET_VIN", action.payload);
            return { ...state, vin: action.payload };
    }
};

export const PatientContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(patientReducer, {
        vin: null,
    });

    // get 'vin' from localhost if exists
    useEffect(() => {
        const vin = JSON.parse(localStorage.getItem("vin"));

        if (vin) {
            dispatch({ type: "SET_VIN", payload: vin });
        }
    }, []);

    return (
        <PatientContext.Provider value={{...state, dispatch}}>
            {children}
        </PatientContext.Provider>
    )
};


