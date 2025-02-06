import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const passwordVisibillity = () => {
        setShowPassword((prevState) => !prevState); // untuk setting false dan true visibillity
    }

    // Untuk ngecek token di local storage
    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (token) {
        setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
        const response = await axios.post('http://localhost:3001/auth/login', {
            email,
            password,
        });

        if (response.data) {
            const token = response.data.token;
            const user_id = response.data.user_id;
            
            localStorage.setItem("token", token); 
            localStorage.setItem("user_id", user_id); 
            setIsLoggedIn(true); 

            Swal.fire({
            title: "Yeah Dude!",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
            })
            // console.log("user nya: ", user_id);
            
        } else {
            alert("Login failed!");
        }

        // Redirect ke dashboard
        navigate('/');
        } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
        console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        setIsLoggedIn(false); // Update logged-out state
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {!isLoggedIn ? (
                <form
                onSubmit={handleLogin}
                className="w-full max-w-sm bg-white rounded-lg shadow-md p-6"
                >
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
                {error && (
                    <p className="text-sm text-red-500 text-center mb-4">{error}</p>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                    Password
                    </label>
                    <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={passwordVisibillity}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? (
                        <IoEyeOutline />
                        ) : (
                        <IoEyeOffOutline />
                        )}
                    </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Login
                </button>
                <p className="text-sm text-center text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <a
                    href="/register"
                    className="text-blue-500 hover:underline"
                    >
                    Register
                    </a>
                </p>
                </form>
            ) : (
                <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
                </div>
            )}
            </div>
        </>
    );
  
}

export default Login;