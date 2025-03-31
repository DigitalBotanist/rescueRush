import React from 'react'

export default function AddDoctordetails() {
  return (
    <div className='AddDoctordetails'>
      <div className='AddDoctorDetails-container'>
        <h1 className='AddDoctorDetails-container-h1'>Add Doctor Details</h1>
        <div className='AddDoctorDetails-container-inputfield'>
            <label>Entet Name :</label>
            <input type='tetx' className='AddDoctorDetails-container-input' placeholder='Enter name'></input>
        </div>

        <div className='AddDoctorDetails-container-inputfield'>
            <label>Entet Special :</label>
            <input type='tetx' className='AddDoctorDetails-container-input' placeholder='Enter Special'></input>
        </div>

        <div className='AddDoctorDetails-container-inputfield'>
            <label>Enter time :</label>
            <input type='tetx' className='AddDoctorDetails-container-input' placeholder='Enter time'></input>
        </div>

        
        <button className='AddDoctorDetails-containe-button'>Submit</button>
       
       
        
      </div>
    </div>
  )
}
