import { useState } from "react"
import { useLogin } from "../hooks/useParamedicLogin"


const ParamedicLogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading, error} = useLogin()

    const handleSubmit = async(e) =>
    {
        //stop refreshing page after submit
        e.preventDefault()
        console.log("submitting form")
         await login(email,password)
    }

    return (
        <div className="paramedic-login-box">
           <form className="paramedic-login-form" onSubmit={handleSubmit}>
                <h3 className="paramedic-login-title">Ambulance Staff Login</h3>
                <div className="paramedic-input-box">
                <label className="paramedic-label">E-mail</label>
                <input className="paramedic-login-input" type="email" required placeholder="Enter email" onChange={(e)=>{setEmail(e.target.value)}}></input>
                <label className="paramedic-label">Password</label>
                <input className="paramedic-login-input" type="password" required placeholder="Enter password" onChange={(e)=>{setPassword(e.target.value)}}></input>
                <button className="paramedic-login-btn" type="submit">Login</button></div>
            </form> 
        </div>  
     
    )
}



export default ParamedicLogin