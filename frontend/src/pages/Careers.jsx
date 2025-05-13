import { useState } from "react";
import PublicNavBar from "../components/PublicNavBar";
import { Link } from "react-router-dom";

const Careers = () => {
    const [activeTab, setActiveTab] = useState("driver");

    return (
        <div className="h-screen p-1">
            <PublicNavBar />
            <div className="flex h-full w-3/4 mx-auto my-[10vh] p-5">
                {/* left */}
                <div className="flex-1 flex flex-col items-end p-20 pt-40 gap-10">
                    <p
                        className={`text-3xl hover:text-4xl hover:font-normal cursor-pointer font-light ${
                            activeTab === "paramedic" &&
                            "text-5xl font-normal hover:text-5xl"
                        }`}
                        onClick={() => setActiveTab("paramedic")}
                    >
                        PARAMEDIC
                    </p>
                    <p
                        className={`text-3xl hover:text-4xl hover:font-normal cursor-pointer font-light ${
                            activeTab === "dispatcher" &&
                            "text-5xl font-normal hover:text-5xl"
                        }`}
                        onClick={() => setActiveTab("dispatcher")}
                    >
                        DISPATCHER
                    </p>
                    <p
                        className={`text-3xl hover:text-4xl hover:font-normal cursor-pointer font-light ${
                            activeTab === "driver" &&
                            "text-5xl font-normal hover:text-5xl"
                        }`}
                        onClick={() => setActiveTab("driver")}
                    >
                        AMBULANCE DRIVER
                    </p>
                    <p
                        className={`text-3xl hover:text-4xl hover:font-normal cursor-pointer font-light ${
                            activeTab === "hospital" &&
                            "text-5xl font-normal hover:text-5xl"
                        }`}
                        onClick={() => setActiveTab("hospital")}
                    >
                        Hospital Staff
                    </p>
                    <p
                        className={`text-3xl hover:text-4xl hover:font-normal cursor-pointer font-light ${
                            activeTab === "manager" &&
                            "text-5xl font-normal hover:text-5xl"
                        }`}
                        onClick={() => setActiveTab("manager")}
                    >
                        Manager
                    </p>
                </div>
                {/* right */}
                <div className="flex-1  p-20">
                    {/* driver */}
                    {activeTab === "driver" && (
                        <div className="flex flex-col gap-8">
                            <img src="/assets/career_driver.png" alt="driver" />
                            <p className="font-light text-lg">
                                Join our team as an ambulance driver and play a
                                vital role in saving lives. You’ll be
                                responsible for safe and efficient patient
                                transport, assisting medical staff, and ensuring
                                the ambulance is always ready for emergencies. A
                                valid driver’s license, quick thinking, and
                                professionalism are essential for this role.
                            </p>
                            <p>
                                <span className="text-2xl capitalize">
                                    Responsibilities:
                                </span>
                                <ul className="list-disc font-light text-lg">
                                    <li>
                                        Safely transport patients to medical
                                        facilities.
                                    </li>
                                    <li>
                                        Respond promptly to emergency calls.
                                    </li>
                                    <li>
                                        Assist paramedics with patient handling.
                                    </li>
                                    <li>
                                        Maintain the ambulance in clean and
                                        working condition.
                                    </li>
                                    <li>
                                        Follow traffic laws and safety
                                        protocols.
                                    </li>
                                </ul>
                            </p>
                            <Link
                                to="/contacts"
                                className="bg-primary text-white w-40 p-3 rounded-2xl self-end"
                            >
                                contact us -&gt;
                            </Link>
                        </div>
                    )}
                    {/* paramedic */}
                    {activeTab === "paramedic" && (
                        <div className="flex flex-col gap-8">
                            <img
                                src="/assets/career_paramedic.png"
                                alt="driver"
                            />
                            <p className="font-light text-lg">
                                Become a paramedic and be on the frontlines of
                                emergency medical care. You’ll provide critical
                                care, assess patients, and coordinate with
                                hospital staff to ensure timely treatment.
                                Strong medical knowledge, quick decision-making,
                                and compassion are key to excelling in this
                                role.
                            </p>
                            <p>
                                <span className="text-2xl capitalize">
                                    Responsibilities:
                                </span>
                                <ul className="list-disc font-light text-lg">
                                    <li>
                                        Provide emergency medical treatment to
                                        patients.
                                    </li>
                                    <li>
                                        Assess patient conditions and administer
                                        necessary care.
                                    </li>
                                    <li>
                                        Operate and maintain life-saving medical
                                        equipment.
                                    </li>
                                    <li>
                                        Coordinate with hospitals for patient
                                        transport.
                                    </li>
                                    <li>
                                        Ensure accurate documentation of medical
                                        reports.
                                    </li>
                                </ul>
                            </p>
                            <Link
                                to="/contacts"
                                className="bg-primary text-white w-40 p-3 rounded-2xl self-end"
                            >
                                contact us -&gt;
                            </Link>
                        </div>
                    )}
                    {/* hospital */}
                    {activeTab === "hospital" && (
                        <div className="flex flex-col gap-8">
                            <img
                                src="/assets/career_hospital.png"
                                alt="driver"
                            />
                            <p className="font-light text-lg">
                                Join our hospital team and play a crucial role
                                in patient care. From administrative support to
                                assisting medical professionals, your work
                                ensures smooth operations and quality healthcare
                                services.
                            </p>
                            <p>
                                <span className="text-2xl capitalize">
                                    Responsibilities:
                                </span>
                                <ul className="list-disc font-light text-lg">
                                    <li>
                                        Assist doctors and nurses in daily
                                        tasks.
                                    </li>
                                    <li>
                                        Manage patient records and hospital
                                        documentation.
                                    </li>
                                    <li>
                                        Ensure hospital facilities are
                                        well-maintained.
                                    </li>
                                    <li>
                                        Provide assistance to patients and
                                        visitors.
                                    </li>
                                    <li>
                                        Maintain hygiene and safety standards.
                                    </li>
                                </ul>
                            </p>
                            <Link
                                to="/contacts"
                                className="bg-primary text-white w-40 p-3 rounded-2xl self-end"
                            >
                                contact us -&gt;
                            </Link>
                        </div>
                    )}
                    {/* dispatcher */}
                    {activeTab === "dispatcher" && (
                        <div className="flex flex-col gap-8">
                            <img
                                src="/assets/career_dispatcher.png"
                                alt="driver"
                            />
                            <p className="font-light text-lg">
                                As a dispatcher, you’ll be the first point of
                                contact in emergency situations. Your role
                                involves handling emergency calls, coordinating
                                ambulance dispatches, and ensuring a swift
                                response to critical incidents.
                            </p>
                            <p>
                                <span className="text-2xl capitalize">
                                    Responsibilities:
                                </span>
                                <ul className="list-disc font-light text-lg">
                                    <li>
                                        Receive and prioritize emergency calls.
                                    </li>
                                    <li>
                                        Dispatch ambulances and coordinate
                                        response efforts.
                                    </li>
                                    <li>
                                        Maintain communication with paramedics
                                        and hospitals.
                                    </li>
                                    <li>
                                        Keep accurate records of emergency
                                        incidents.
                                    </li>
                                    <li>
                                        Provide instructions to callers in
                                        critical situations.
                                    </li>
                                </ul>
                            </p>
                            <Link
                                to="/contacts"
                                className="bg-primary text-white w-40 p-3 rounded-2xl self-end"
                            >
                                contact us -&gt;
                            </Link>
                        </div>
                    )}
                    {/* manager */}
                    {activeTab === "manager" && (
                        <div className="flex flex-col gap-8">
                            <img src="/assets/career_manager.png" alt="driver" />
                            <p className="font-light text-lg">
                                Lead and coordinate emergency medical services
                                as a manager. You’ll oversee daily operations,
                                manage staff, and ensure that resources are
                                efficiently utilized to provide the best
                                emergency care.
                            </p>
                            <p>
                                <span className="text-2xl capitalize">
                                    Responsibilities:
                                </span>
                                <ul className="list-disc font-light text-lg">
                                    <li>
                                        Oversee daily EMS operations and staff
                                        performance.
                                    </li>
                                    <li>
                                        Ensure compliance with healthcare
                                        regulations.
                                    </li>
                                    <li>
                                        Manage budgets, resources, and
                                        scheduling.
                                    </li>
                                    <li>
                                        Develop and implement emergency response
                                        protocols.
                                    </li>
                                    <li>
                                        Facilitate training and development
                                        programs.
                                    </li>
                                </ul>
                            </p>
                            <Link
                                to="/contacts"
                                className="bg-primary text-white w-40 p-3 rounded-2xl self-end"
                            >
                                contact us -&gt;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Careers;
