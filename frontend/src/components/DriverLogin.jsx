import { useState } from "react";
import { useDriverLogin } from "../hooks/useDriverLogin";
import { Link } from "react-router-dom";

const DriverLogin = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const { login, isLoading, error } = useDriverLogin(); // use useDriverLogin hook

    // handle submit button click
    const handleSubmit = async (e) => {
        e.preventDefault();

        // run the login function
        await login(email, password);
    };

    return (
        <div className="h-full bg-gradient-to-br from-white via-secondary-300 to-primary-400 animate-gradient bg-[length:400%_400%]">
            <div className="h-19/20 flex flex-col items-center justify-center">
                <div className="">
                    {/* back button */}
                    <div className="text-center sm:text-left whitespace-nowrap">
                        <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                            <span className="inline-block ml-1">
                                <Link to="/vehicle">back</Link>
                            </span>
                        </button>
                    </div>
                    {/* login container */}
                    <div className="xs:p-0 md:w-full md:max-w-md">
                        {/* login form */}
                        <form
                            method="post"
                            className="bg-white shadow w-full rounded-2xl p-5"
                            onSubmit={handleSubmit}
                        >
                            <h1 className="font-medium text-center text-4xl my-5 p-1">
                                Driver Login
                            </h1>
                            <div className="px-5 py-7 min-w-100">
                                {/* input email */}
                                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                                    E-mail
                                </label>
                                <input
                                    type="text"
                                    className="border border-gray-400 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                {/* input password */}
                                <label className="font-semibold text-sm text-gray-600 pb-1 block">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="border rounded-lg border-gray-400 px-3 py-2 mt-1 mb-5 text-sm w-full"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                />
                                {/* submit button */}
                                <button
                                    type="submit"
                                    className="transition duration-200 bg-primary-500 hover:bg-primary-600 focus:shadow-sm text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                                    disabled={isLoading}
                                >
                                    <span className="inline-block mr-2">
                                        Login
                                    </span>
                                </button>
                                {/* if there is an error when login, shows the error */}
                                {error && (
                                    <div className="text-red-500 text-sm mt-2">
                                        Error: {error}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverLogin;
