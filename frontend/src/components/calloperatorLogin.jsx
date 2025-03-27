import {useState}from 'react';
import { useCallOperatorLogin } from "../hooks/useCallOperatorLogin";

import {Link } from "react-router-dom";



const Login =() =>{
    const [email,setEmail] = useState();
    const[password,setPassword]=useState();
    const{login,isLoading,error}=useCalloperatorLogin();

    const handleSubmit=async(e)=>{
        e.preventDefault();

        await login(email,password);
    };

    return(
        <div className="callOperator-login-box">
           <form className="callOperatorlogin-form" onSubmit={handleSubmit}>
                <h3 className="callOperator-login-title">Call Operator Login</h3>
                <div className="callOperator-input-box">
                <label className="callOperator-label">E-mail</label>
                <input className="callOperator-login-input" type="email" required placeholder="Enter email" onChange={(e)=>{setEmail(e.target.value)}}></input>
                <label className="callOperator-label">Password</label>
                <input className="callOperator-login-input" type="password" required placeholder="Enter password" onChange={(e)=>{setPassword(e.target.value)}}></input>
                <button className="callOperator-login-btn" type="submit">Login</button></div>
            </form> 
        </div>
    )

}