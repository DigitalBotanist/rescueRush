import PublicNavBar from "../components/PublicNavBar";

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
                Accept: "application/json",
            },
            body: json,
        }).then((res) => res.json());

        if (res.success) {
            console.log("Success", res);
            alert("Success");
        }
    };

    return (
        // <div className="Container">
        //   <img src ="/assets/background_ContactUs.jpg" className="background_image" />
        //   <div className="container_form">
        //     <h3>Send Message</h3>
        //     <form onSubmit={onSubmit}>
        //       <input type='text' name="name" placeholder="Enter Name" required></input><hr/>
        //       <input type='mail' name="email" placeholder="Enter email" required></input><hr/>
        //       <textarea name="message" placeholder="Message" required></textarea><hr/>

        //       <button  type="submit" className="formbtn">Send</button>
        //     </form>

        //   </div>

        //   <div className="container_contact">
        //     <div className="container_contact_mail">
        //          <img src="/assets/email.png"  />
        //          <div className="container_contact_mail_text">
        //           <h4>Mail</h4>
        //           <p>rescuerush@gmail.com</p>
        //          </div>

        //     </div>

        //     <div className="container_contact_phone">
        //          <img src="/assets/phone.png"  />
        //          <div className="container_contact_phone_text">
        //           <h4>Phone</h4>
        //           <p>956</p>
        //          </div>

        //     </div>

        //   </div>

        //    <div className="container_social">

        //      <img src="/assets/Twitterapp.png"  style={{ width: '50px', height: '50px' }}/>
        //      <img src="/assets/fb.png"  style={{ width: '50px', height: '50px' }}/>
        //      <img src="/assets/Globe.png"  style={{ width: '50px', height: '50px' }}/>
        //    </div>

        // </div>

        <div className="h-screen w-screen">
            {/* nav bar */}
            <PublicNavBar />
            <div className="h-full w-full relative">
                <div
                    className="absolute h-full w-full bg-cover bg-left-top"
                    style={{
                        backgroundImage:
                            "url('/assets/background_ContactUs.jpg')",
                    }}
                ></div>
                <div className="flex absolute right-1/5 top-1/2 -translate-y-1/2 gap-20 items-center">
                    <div className="flex flex-col gap-10">
                            <div className="flex h-20 gap-3 items-center">
                                <img
                                    src="/assets/email.png"
                                    className="h-full "
                                />
                                <div className="">
                                    <h4 className="text-primary-400 font-bold">
                                        Mail
                                    </h4>
                                    <p>rescuerush@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex h-20 gap-3 items-center">
                                <img
                                    src="/assets/phone.png"
                                    className="h-full "
                                />
                                <div className="dt">
                                    <h4 className="text-primary-400 font-bold">
                                        Phone
                                    </h4>
                                    <p>956</p>
                                </div>
                            </div>
                        <div className="flex justify-between px-10">
                            <img
                                src="/assets/Twitterapp.png"
                                style={{ width: "50px", height: "50px" }}
                            />
                            <img
                                src="/assets/fb.png"
                                style={{ width: "50px", height: "50px" }}
                            />
                            <img
                                src="/assets/Globe.png"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-6 bg-white rounded-2xl p-10 shadow-2xl w-100">
                        <h3 className="text-2xl font-medium">Send Message</h3>
                        <form className="flex flex-col gap-5 " onSubmit={onSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Name"
                                required
                                className="p-4 border border-gray-300 rounded-lg"
                            ></input>
                            <input
                                type="mail"
                                name="email"
                                placeholder="Enter email"
                                required
                                className="p-4 border border-gray-300 rounded-lg"
                            ></input>
                            <textarea
                                name="message"
                                placeholder="Message"
                                required
                                className="p-4 border border-gray-300 rounded-lg h-40"
                            ></textarea>
                            <button type="submit" className="bg-primary-500 text-white rounded-2xl p-5">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;
