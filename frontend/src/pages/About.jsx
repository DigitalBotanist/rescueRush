import NavBar from '../components/NavBar'
import PublicNavBar from '../components/PublicNavBar';

const About = () => {
    return (
      <div>
        <PublicNavBar/>
        <div className='About-us-whole m-0 p-1'>
        <div  className='About-us-top-div'>
        <h1 className="About-us-heading mt-10">"Real-time Tacking, Real-time Care."</h1>
        <p className="About-us-headline">
          The ambulance, which is a lifesaving vehicle, must also have an Ambulance Management system that can reduce the risk, build a strong connection between the hospital and the dispatcher, and track the ambulance and the patient’s conditions in real time.
        </p>
        </div>
        </div>
        
        <div className="About-us-intro-box">
        <div className="About-us-intro-box-img">

        </div>
        <div className="About-us-intro-box-word">
        <h1 className="About-us-what">What is Rescue Rush?</h1>
        <p className="About-us-introduction">
          Rescue Rush is a smart, user-friendly online platform built for healthcare professionals to manage ambulance services, reduce delays, miscommunication, unorganized data, and human energy, and smoothen the process of saving a life.
        </p>
        <h4 className="About-us-features-heading">Technology and Innovation</h4>
        <ul className="About-us-features">
          <li>Hospital management - Ensure that patients get the best even before hospital arrival by proper coordination between the ambulance and the hospital.</li>
          <li>Vehicle management - Provide drivers with navigation assistance, alerts, and live updates for better performance.</li>
          <li>Call management - Optimize call flow and ambulance allocation to minimize response times.</li>
          <li>Patient management - Efficiently track, manage, and update patient information in real-time for better emergency care.</li>
          <li>Resource management - Optimize scheduling and allocation of staff and medical equipment for proper time management.</li>
        </ul>
        </div>
        </div>

        <div className="About-us-promotion-box">
        <div className="About-us-promotion-box-services">
        <div className="About-us-promotion-box-247">
        <h3>24/7</h3>
        <p>Service</p>
        </div> 
        <div className="About-us-promotion-box-saved">
        <h3>100+</h3>
        <p>Lives saved</p>
        </div>  
        <div className="About-us-promotion-box-employees">
        <h3>50+</h3>
        <p>employees</p>
        </div>  
        <div className="About-us-promotion-box-trust">
        <h3>100+</h3>
        <p>Trusted Hospitals</p>
        </div>  
        </div>
        <div className='About-us-promotion-box-services-img'></div>  
        </div>

        <div className="About-us-Mission-box">
        
        <div className="About-us-Mission-box-img">
        </div>
        <div className="About-us-Mission-box-word">
        <h3 className="About-us-Mission"> Our Mission   </h3>
        <p className="About-us-Mission-p">To provide compassionate, high-quality healthcare and ambulance services that enhance the well-being of every patient we serve and reduce the workload of healthcare professionals with advanced technology and innovation.</p>
        </div>
        </div>

        <div className="About-us-Vision-box">
        <div className="About-us-Vision-box-word">
        <h3 className="About-us-Vision">Our Vision</h3>
        <p className="About-us-Vision-p">To be a trusted non-profit ambulance service that transforms emergency medical care through innovation, ensuring that no life is lost due to delayed response or lack of resources.</p>
        </div>
        <div className="About-us-Vision-box-img">
        </div>
        </div>
        
      </div>
      
    );
  };
  
  export default About;