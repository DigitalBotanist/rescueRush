import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicNavBar from "../components/PublicNavBar";

const Home = () => {
    const [currentSection, setCurrentSection] = useState(0);

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const handleScroll = (event) => {
            event.preventDefault(); // Prevent default scrolling
            if (event.deltaY > 0 && currentSection < sections.length - 1) {
                setCurrentSection((prev) => prev + 1);
            } else if (event.deltaY < 0 && currentSection > 0) {
                setCurrentSection((prev) => prev - 1);
            }
        };

        window.addEventListener("wheel", handleScroll, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleScroll);
        };
    }, [currentSection]);

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        sections[currentSection]?.scrollIntoView({ behavior: "smooth" });
    }, [currentSection]);

    return (
        <div className="h-screen overflow-hidden">
            <PublicNavBar />
            <div className="h-screen overflow-hidden">
                <section className="h-screen bg-[url(/assets/home-background.png)] bg-cover p-1 box-border">
                    <div className="relative w-7/10 left-1/10 mt-60">
                        <h1 className="text-white text-8xl font-bold">
                            Always Ready, Anytime,
                        </h1>
                        <h1 className="text-white text-8xl font-bold">
                            Anywhere!
                        </h1>
                        <p className="my-10 w-7/10 text-white text-base">
                            Welcome to Rescue Rush, your trusted emergency
                            medical transport provider. We offer 24/7 ambulance
                            services with the fastest response times, ensuring
                            safe, reliable, and professional medical assistance
                            whenever you need it. Whether it’s an emergency or
                            non-emergency transport, we are here to help!
                        </p>
                        <a
                            href="#about_us"
                            className="bg-teal-700 p-5 rounded-2xl text-white cursor-pointer shadow shadow-white/5 hover:bg-teal-900"
                        >
                            See more details
                        </a>
                    </div>
                </section>

                <section id="services" className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-10 py-20">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">How We Help</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl">
                    {["24/7 Emergency Response", "Under 7-Min Arrival", "Free Medical Transport"].map((service, index) => (
                        <div key={index} className="p-8 bg-gray-800 rounded-xl shadow-lg text-center hover:scale-105 transition">
                            <h3 className="text-2xl font-semibold">{service}</h3>
                            <p className="text-gray-400 mt-2">Reliable, fast, and always available.</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="h-screen flex flex-col md:flex-row items-center bg-white px-10 py-20">
                <div className="md:w-1/2 flex flex-col gap-6">
                    <h2 className="text-4xl font-bold">Your Safety, Our Mission</h2>
                    <p className="text-lg text-gray-600">
                        We are more than just an ambulance service. We’re a team of medical experts, ready to save lives.
                    </p>
                    <Link to="/about" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
                        More About Us
                    </Link>
                </div>
                <img src="/assets/home_section3.png" className="md:w-1/2 rounded-xl shadow-lg" alt="Medical team" />
            </section>

            </div>
        </div>
    );
};

export default Home;
