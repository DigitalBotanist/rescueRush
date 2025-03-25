const Contacts = () => {

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "48df1d64-6282-4c74-bb98-663423c14bca");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
      alert("Success")
    }
  };



  return(
    <div className="Container">
      <img src ="/assets/background_ContactUs.jpg" className="background_image" />
      <div className="container_form">
        <h3>Send Message</h3>
        <form onSubmit={onSubmit}> 
          <input type='text' name="name" placeholder="Enter Name" required></input><hr/>
          <input type='mail' name="email" placeholder="Enter email" required></input><hr/>
          <textarea name="message" placeholder="Message" required></textarea><hr/>
          
          <button  type="submit" className="formbtn">Send</button>
        </form>
        
      </div>
      
      <div className="container_contact">
        <div className="container_contact_mail">
             <img src="/assets/email.png"  />
             <div className="container_contact_mail_text">
              <h4>Mail</h4>
              <p>rescuerush@gmail.com</p>
             </div>
             
        </div>
          

        <div className="container_contact_phone">
             <img src="/assets/phone.png"  />
             <div className="container_contact_phone_text">
              <h4>Phone</h4>
              <p>956</p>
             </div>
             
        </div>
        
      </div>

      
     
       <div className="container_social">
       
         <img src="/assets/Twitterapp.png"  style={{ width: '50px', height: '50px' }}/>
         <img src="/assets/fb.png"  style={{ width: '50px', height: '50px' }}/>
         <img src="/assets/Globe.png"  style={{ width: '50px', height: '50px' }}/>
       </div>


    </div>
  )
}

export default Contacts
