import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useCallOperatorLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/call_operator/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Login failed');
            }

            // Save user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // Update auth context
            dispatch({ type: 'LOGIN', payload: json });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
