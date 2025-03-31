import { Link, useLocation } from "react-router-dom";

const PublicNavBar = () => {
    const location = useLocation(); // Get the current path

    return (
        <nav className=" z-10 fixed top-5 left-1/2 -translate-x-1/2 h-[8vh] bg-black/50 w-7/10  mx-auto rounded-2xl flex p-3 px-10 items-center justify-between "> 
            <img src="/assets/logo_text_white.svg" alt="logo" className="h-9/10" />
            <div className="text-white flex gap-8">
                {[
                    { name: "Home", path: "/" },
                    { name: "About", path: "/about" },
                    { name: "Contact Us", path: "/contacts" },
                    { name: "Careers", path: "/careers" },
                ].map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`text-md transition hover:text-primary hover:text-lg ${
                            location.pathname === link.path ? "text-primary font-bold text-lg" : ""
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default PublicNavBar;
