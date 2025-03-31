import { useState } from "react"
import { useHospitalLogin } from "../hooks/useHospitalLogin"

const HospitalStaffLogin = () =>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const {login, isLoading, error } =useHospitalLogin()

    const handleSubmit = async (e)=>{
        e.preventDefault()

       await login (email,password)
    }

    return(
        <div className="HospitalStaff_login_box">
            <form onSubmit={handleSubmit} className="HospitalStaffLogin_Form" >
                <h3 className="HospitalStaff-login-title" >Hospital Staff Login</h3>

                <div className="HospitalStaffLogin_Form_inputFields">
                    
                        {/*Email */}
                        <label className="HospitalStaff-login-label">Email</label>
                        <input 
                            className="HospitalStaff-login-input"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    

                   
                        {/*Password */}
                        <label className=" HospitalStaff-login-label">Password</label>
                        <input 
                            className="HospitalStaff-login-input"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />

                        <button className="HospitalStaff-login-btn" disabled={isLoading}>Login</button>
                        {error && <div className="text-primary">{error}</div>}
                    </div>
            </form>
        </div>
        
    )
}

export default HospitalStaffLogin;