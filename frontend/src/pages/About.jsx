import NavBar from '../components/NavBar'
import PublicNavBar from '../components/PublicNavBar';

const About = () => {
    return (
      <div>
        <PublicNavBar/>
        <div className='About-us-whole m-0 p-1'>
        <div  className='About-us-top-div'>
        <h1 className="About-us-heading mt-10">"Real-time Tacking, Real-time Care."</h1>
        </div>
        </div>
        <div className="About-us-intro-box">
        <div className="About-us-intro-box-img"></div>
        <div className="About-us-intro-box-word">
        <h1 className="About-us-what">What is Rescue Rush?</h1>
        <p className="About-us-introduction">
          Rescue Rush is a smart, user-friendly online platform built for healthcare professionals to manage ambulance services, reduce delays, miscommunication, unorganized data, and human energy, and smoothen the process of saving a life.
        </p>
        </div>
        </div>

      
        <div className="About-us-promotion-box-services">
        <div className="About-us-promotion-box-247">
        <i class="material-icons">airport_shuttle</i>
        <h3>24/7</h3>
        <p>Service</p>
        </div> 
        <div className="About-us-promotion-box-saved">
        <i class="material-icons">favorite</i>
        <h3>100+</h3>
        <p>Lives saved</p>
        </div>  
        <div className="About-us-promotion-box-employees">
        <i class="material-icons">diversity_3</i>
        <h3>50+</h3>
        <p>employees</p>
        </div>  
        <div className="About-us-promotion-box-trust">
        <i class="material-icons">local_hospital</i>
        <h3>100+</h3>
        <p>Trusted Hospitals</p>
        </div>  
        </div>

        <div className="About-us-specials-whole">
        <h4 className="About-us-features-heading">Our Specialties</h4>
        <h4 class="specials-tagline">We empower emergency medical services by integrating intelligent, real-time systems for hospital, vehicle, call, patient, and resource management — ensuring faster response times, better coordination, and ultimately, improved patient care.</h4>
        <div className="About-us-specials">
          <div><i class="material-icons">local_hospital</i><h2>Hospital management</h2>  <p> Ensure that patients get the best even before hospital arrival by proper coordination between the ambulance and the hospital.</p></div>
          <div><i class="material-icons">alt_route</i><h2>Vehicle management </h2> <p> Provide drivers with navigation assistance, alerts, and live updates for better performance.</p></div>
          <div><i class="material-icons">support_agent</i><h2>Call management</h2>  <p>Optimize call flow and ambulance allocation to minimize response times.</p></div>
          <div><i class="material-icons">health_and_safety</i><h2>Patient management</h2>  <p>Efficiently track, manage, and update patient information in real-time for better emergency care.</p></div>
          <div><i class="material-icons">event_note</i><h2>Resource management </h2> <p>Optimize scheduling and allocation of staff and medical equipment for proper time management.</p></div>
        </div>
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