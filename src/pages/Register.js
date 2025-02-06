import React, { useState } from 'react';
import axios from 'axios';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const passwordVisibillity = () => {
        setShowPassword((prevState) => !prevState); // untuk setting false dan true visibillity
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if(!validateEmail(email)) { // untuk cek validasi email
            alert('Please enter a valid email address')
            return;
        }

        if(password.length < 5) { // cek password harus lebih dari 5 character
            alert('Password must be at least 5 characters long')
            return;
        }

        try {
            await axios.post('http://localhost:3001/auth/register', { email, name, password }, 
            {
                headers: { 'Content-Type': 'application/json' }
            }); 

            Swal.fire({
                title: "Success!",
                text: "Please login to access this page.",
                icon: "success",
                confirmButtonText: "OK",
            })

            navigate('/login');
        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-sm bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
                <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                </div>
                <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                </label>
                <input
                    type="name"
                    id="name"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
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
                Register
                </button>
                <p className="text-sm text-center text-gray-600 mt-4">
                Already registered?{" "}
                <a
                    href="/login"
                    className="text-blue-500 hover:underline"
                >
                    Login
                </a>
                </p>
            </form>
        </div>
    );
}

export default Register;