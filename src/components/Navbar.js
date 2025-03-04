import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setIsLoggedIn(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.reload();
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-900 bebas-neue-regular">
                    Satan Library
                </Link>

                {/* Navbar Items */}
                <div className="hidden md:flex space-x-6 font-serif">
                    <Link to="/" className="btn btn-ghost text-gray-700">Home</Link>
                    <Link to="/add-book" className="btn btn-ghost text-gray-700">Add New Book</Link>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="btn btn-error text-gray-700">Logout</button>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden btn btn-square btn-ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden flex flex-col items-center space-y-4 p-4 bg-gray-100 shadow-md font-serif">
                    <Link to="/" className="btn btn-ghost w-full" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/add-book" className="btn btn-ghost w-full" onClick={() => setIsMenuOpen(false)}>Add New Book</Link>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="btn btn-error w-full text-gray-700">Logout</button>
                    ) : (
                        <Link to="/login" className="btn btn-primary w-full">Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
