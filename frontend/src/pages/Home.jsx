import { Link } from "react-router-dom";
import PublicNavBar from "../components/PublicNavBar";

const Home = () => {
    return (
        <div className="">
            <PublicNavBar />
            <div className="h-screen  bg-[url(/assets/home-background.png)] bg-cover p-1 box-border">
                <div className="relative w-7/10 left-1/10 mt-60">
                    <h1 className="text-white text-8xl font-bold">
                        Always Ready, Anytime,
                    </h1>
                    <h1 className="text-white text-8xl font-bold">Anywhere!</h1>
                    <p className="my-10 w-7/10 text-white text-base">
                        Welcome to Rescue Rush, your trusted emergency medical
                        transport provider. We offer 24/7 ambulance services
                        with the fastest response times, ensuring safe,
                        reliable, and professional medical assistance whenever
                        you need it. Whether it’s an emergency or non-emergency
                        transport, we are here to help!
                    </p>
                    <a
                        href="#about_us"
                        className="bg-teal-700 p-5 rounded-2xl text-white cursor-pointer shadow shadow-white/5 hover:bg-teal-900 "
                    >
                        See more details
                    </a>
                </div>
            </div>

            {/* second section */}
            <section
                id="about_us"
                className="h-screen bg-gradient-to-r from-orange-300 via to-blue-600 pt-1"
            >
                <div className="mt-20 p-50 flex w-full gap-20">
                    <div className="flex flex-col items-center justify-between aspect-square bg-white/30 p-10 rounded-2xl w-1/3">
                        <img
                            src="/assets/home_24.png"
                            alt=""
                            className="w-75"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-medium text-secondary-950">
                                24/7 Emergency Service
                            </h1>
                            <p className="text-md px-5 text-center">
                                Available any time, any day—our ambulances are
                                always ready.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between aspect-square bg-white/30 p-10 rounded-2xl w-1/3">
                        <img
                            src="/assets/home_time.png"
                            alt=""
                            className="w-75"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-medium text-secondary-950">
                                Less than 7-Min Response
                            </h1>
                            <p className="text-md px-5 text-center">
                                We dispatch the nearest ambulance within
                                minutes..
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between aspect-square bg-white/30 p-10 rounded-2xl w-1/3">
                        <img
                            src="/assets/home_ambulance.png"
                            alt=""
                            className="w-75 object-contain flex-1"
                        />
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-medium text-secondary-950">
                                Free Medical Transport
                            </h1>
                            <p className="text-md px-5 text-center">
                                Completely free hospital transfers for emergency
                                cases.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* section 3 */}
            <section className="h-screen">
                <div className="w-full flex gap-20 p-50 justify-between">
                    <div className="flex-1 flex flex-col items-center gap-10 w-1/2 m-20 p-10 border border-gray-300 rounded-2xl">
                        <h1 className="text-5xl">Who are we</h1>
                        <p className="text-lg">
                            We are Rescue Rush, a trusted emergency medical
                            response team dedicated to providing fast, reliable,
                            and life-saving ambulance services in  Sri Lanka.
                            With a network of advanced ambulances, skilled
                            paramedics, and cutting-edge technology, we ensure
                            that help arrives when every second counts.
                        </p>
                        <p className="text-lg">
                            Rescue Rush is committed to delivering swift and
                            dependable emergency medical services across Sri
                            Lanka. Our fleet of state-of-the-art ambulances,
                            alongside highly trained paramedics, ensures that
                            patients receive timely and professional care in
                            critical situations. With a focus on efficiency and
                            advanced medical technology, we are always ready to
                            respond when life is on the line.
                        </p>
                        <Link to="about" className="bg-primary p-5 rounded-lg text-white">
                            More about us
                        </Link>
                    </div>
                    <img
                        src="/assets/home_section3.png"
                        className="flex-1 w-1/2"
                        alt="img"
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;
