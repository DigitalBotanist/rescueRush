import { createContext, useContext, useEffect, useReducer } from "react";

export const PatientContext = createContext();

export const patientReducer = (state, action) => {

    console.log("reducer triggered")
    switch (action.type) {
        case "SET_VIN":
            console.log("SET_VIN", action.payload);
            return { ...state, vin: action.payload };
        case "SET_PAT":
            console.log("12121212")
            console.log("SET_PAT", action.payload);
            return { ...state, patient: action.payload };
        case "SET_HOSP":
            return { ...state, hospital: action.payload };
        default:
            return state;
    }
};

export const PatientContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(patientReducer, {
        vin: null,
        patient : null,
        hospital:null
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


