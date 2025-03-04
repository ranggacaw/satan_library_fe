import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddBook = () => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        userId: '', // Initially an empty string, later set from localStorage
    });

    const [error, setError] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Check if token and user_id exist before the page renders
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            Swal.fire({
                title: "You need to login first!",
                text: "Please login to access this page.",
                icon: "warning",
                confirmButtonText: "OK",
            }).then(() => {
                navigate('/login');
            });
        } else {
            // Set the userId in form state if available
            setForm((prevForm) => ({ ...prevForm, userId: userId }));
        }
    }, [navigate]);

    // Validate form inputs
    const validateForm = () => {
        const newError = {};
        let valid = true;

        if (!form.title) {
            newError.title = 'Title is required';
            valid = false;
        }

        if (!form.content) {
            newError.content = 'Content is required';
            valid = false;
        }

        if (!form.userId) {
            newError.userId = 'User ID is not set'; // Validation for userId
            valid = false;
        }

        setError(newError);
        return valid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
        setIsSubmitting(true);
    
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
    
        try {
            console.log("Form data:", form);
            console.log("userId from localStorage:", userId);
    
            if (!userId || userId === "undefined") {
                throw new Error("User ID is not set correctly.");
            }
    
            // send data to the backend, let backend handle Firestore
            const response = await axios.post('http://localhost:3001/books/', {
                ...form,
                userId, // Ensure userId is included
            }, {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log("MySQL response:", response.data);
    
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
                navigate('/');
            }, 2000);
        } catch (error) {
            alert(`Failed to add content: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="max-w-2xl w-full bg-white shadow-2xl rounded-xl border border-gray-200 p-10">
                    
                    {/* Book-Like Header */}
                    <h2 className="text-4xl font-serif font-bold text-gray-900 text-center">
                        Add a New Book
                    </h2>
                    <p className="text-gray-600 text-center mt-2 text-lg">
                        Fill in the details below to add a book to the library.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6 font-serif">
                        
                        {/* Title Input */}
                        <div>
                            <label className="text-lg font-medium text-gray-800">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter book title"
                            />
                            {error.title && <p className="mt-1 text-red-600">{error.title}</p>}
                        </div>

                        {/* Content Textarea */}
                        <div>
                            <label className="text-lg font-medium text-gray-800">Synopsis</label>
                            <textarea
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                rows="6"
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Write a short description of the book..."
                            />
                            {error.content && <p className="mt-1 text-red-600">{error.content}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Add Book"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Confirmation Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                            <p className="text-lg font-semibold text-gray-800">
                                ✅ Book Added Successfully!
                            </p>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-success mt-4"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddBook;
