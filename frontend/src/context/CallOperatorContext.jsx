import { createContext, useState, useEffect } from 'react';

export const CallOperatorContext = createContext();

export const CallOperatorReducer = (state,action)=> {
    switch (action.type) {
        case 'LOGIN':
            return {user:action.payload }

        case 'LOGOUT':
            return {user:null}

        default:
            return state
    }
}

export const CallOperatorProvider = ({ children }) => {
    const [operator, setOperator] = useState(null);

    console.log('calloperatorContext state:',state)

    return (
        <CallOperatorContext.Provider value={{...state,setOperator}}>
            {children}
        </CallOperatorContext.Provider>
    )

    // Check if an operator is already logged in
    useEffect(() => {
        const storedOperator = localStorage.getItem('callOperator');
        if (storedOperator) {
            setOperator(JSON.parse(storedOperator));
        }
    }, []);

    // Login function
    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/call_op/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('callOperator', JSON.stringify(data.operator));
                setOperator(data.operator);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('callOperator');
        setOperator(null);
    };

    return (
        <CallOperatorContext.Provider value={{ operator, login, logout }}>
            {children}
        </CallOperatorContext.Provider>
    );
};
