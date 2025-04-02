import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicNavBar from "../components/PublicNavBar";

const Home = () => {
    const [currentSection, setCurrentSection] = useState(0);

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const handleScroll = (event) => {
            event.preventDefault(); // Prevent default scrolling
            if (event.deltaY > 20 && currentSection < sections.length - 1) {
                setCurrentSection((prev) => prev + 1);
            } else if (event.deltaY < -20 && currentSection > 0) {
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

    useEffect(() => {
        const images = document.querySelectorAll(".animated-img");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show-img");
                    }
                });
            },
            { threshold: 0.3 } // Adjust threshold as needed
        );

        images.forEach((img) => observer.observe(img));

        return () => {
            images.forEach((img) => observer.unobserve(img));
        };
    }, []);

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

                {/* second section */}
                <section
                    id="services"
                    className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white"
                >
                    <div className="h-3/4 bg-gray-800 w-full px-100 py-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
                            How We Help
                        </h2>
                        <div className="h-9/10 grid grid-cols-4 gap-4">
                            <div className="flex flex-col justify-between bg-teal-700 p-6 rounded-lg col-span-1 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Join our crew
                                    </h2>
                                    <p className="text-sm mt-2">
                                        Learn more about our career options
                                    </p>
                                </div>
                                <Link
                                    to="/careers"
                                    className="text-white font-bold mt-4 inline-block self-end underline"
                                >
                                    Visit Careers →
                                </Link>
                            </div>
                            <div className="text-black p-6 rounded-lg col-span-2 flex flex-col justify-end transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-[url(/assets/section2-callop.png)] bg-cover">
                                <h2 className="text-2xl font-bold">
                                    24/7 Service
                                </h2>
                                <p className="text-sm mt-2">
                                    Lorem ipsum dolor sit amet, consectetur
                                </p>
                                <p className="text-sm mt-2">adipiscing elit.</p>
                            </div>
                            <div className="relative col-span-1 row-span-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg  bg-[url(/assets/section2-ambulance.png)] bg-cover">
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h2 className="text-2xl font-bold">Fast</h2>
                                    <p className="text-sm">
                                        Lorem ipsum dolor sit amet.
                                    </p>
                                </div>
                            </div>
                            <div className="relative col-span-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-[url(assets/section2-paramedic.png)] bg-cover">
                                <div className="absolute bottom-20 left-4 text-white">
                                    <h2 className="text-2xl font-bold">Crew</h2>
                                    <p className="text-sm">
                                        Lorem ipsum dolor sit amet.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between bg-red-400 p-6 rounded-lg col-span-1 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        About us
                                    </h2>
                                    <p className="text-sm mt-2">
                                        Learn more about us
                                    </p>
                                </div>
                                <Link
                                    to="/about"
                                    className="text-white font-bold mt-4 inline-block self-end underline"
                                >
                                    Visit About us →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="h-screen flex items-center w-screen bg-white px-10 py-20 pr-0">
                    <div className="relative flex flex-col w-full h-9/10">
                        <div className=" ml-15 mt-5 flex flex-col gap-6 z-10">
                            <h2 className="text-9xl font-bold z-10">
                                Island
                                <span className="text-white shadow">
                                    -wide{" "}
                                </span>
                            </h2>
                            <h2 className="text-9xl font-bold z-10">
                                Covera<span className="text-white">ge</span>
                            </h2>
                            <p className="text-lg text-gray-600 w-1/5 ml-5">
                                Our ambulance management system ensures
                                island-wide coverage, providing rapid emergency
                                response to every corner of the region. With a
                                well-coordinated fleet and strategically located
                                units, we guarantee timely medical assistance
                                whenever and wherever it's needed. Your safety
                                is our priority, 24/7.
                            </p>
                        </div>
                        <img
                            src="/assets/section3.png"
                            className="absolute right-0 top-0 w-3/4 h-full object-cover z-0 animated-img "
                            alt="Medical team"
                        />
                        <img
                            src="/assets/srilankanmap.png"
                            className="absolute right-[70%] top-[70%] object-cover z-0 animated-img hidden-img"
                            alt="Sri Lankan Map"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
