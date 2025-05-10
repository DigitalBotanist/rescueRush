import User from '../shared/models/userModel.js';
import Doctor from '../HospitalManagement/models/doctorDetail_Models.js';
import nodemaile from 'nodemailer';

export const sendRequestToDoctor = async (req,res) => {

    try{
        const { email, message } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        const doctor = await Doctor.findById({email})

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        //create Transport
        if(user){
            const transporter =nodemaile.createTransport({
                service:'gmail',
                auth: { 
                    user: user.email,
                    pass: user.password,
                },
            });

            //send mail
            const mailOption ={
                from:user.email,
                to:doctor.email,
                subject:'Emergency Patient Arrived',
                text:message || 'A new patient has arrived at the hospital. Kindly confirm if you are available to attend.'
            };

            transporter.sendMail(mailOption,(error,info)=>{
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Failed to send email' });
                  } else {
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ message: 'Email sent to doctor successfully' });
                  }
            });

        }
    }catch (error) {
        console.error('Request error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
    
};

