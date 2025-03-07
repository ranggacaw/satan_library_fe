import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddBook = () => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        userId: '',
        imageUrl: '', // Tambahkan state untuk gambar
    });

    const [error, setError] = useState({});
    const [previewImage, setPreviewImage] = useState(null); // Untuk menampilkan preview
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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
            setForm((prevForm) => ({ ...prevForm, userId: userId }));
        }
    }, [navigate]);

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
            newError.userId = 'User ID is missing';
            valid = false;
        }

        setError(newError);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        try {
            const response = await axios.post('http://localhost:3001/books/', {
                ...form,
                userId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);
            

            Swal.fire({
                title: "Success!",
                text: "Book added successfully",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            alert(`Failed to add content: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    // Untuk meng-handle input URL gambar
    const handleImageUrlChange = (e) => {
        const imageUrl = e.target.value;
        setForm((prevForm) => ({
            ...prevForm,
            imageUrl: imageUrl,
        }));
        setPreviewImage(imageUrl); // Update preview
    };

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="max-w-2xl w-full bg-white shadow-2xl rounded-xl border border-gray-200 p-10">
                    
                    <h2 className="text-4xl font-serif font-bold text-gray-900 text-center">
                        Add a New Book
                    </h2>
                    <p className="text-gray-600 text-center mt-2 text-lg">
                        Fill in the details below to add a book to the library.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6 font-serif">
                        
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

                        {/* Image URL Input */}
                        <div>
                            <label className="text-lg font-medium text-gray-800">Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={handleImageUrlChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter book cover image URL"
                            />
                            {form.imageUrl && (
                                <div className="mt-3 flex justify-center">
                                    <img src={previewImage} alt="Book Preview" className="w-40 h-40 object-cover rounded-lg shadow-md" />
                                </div>
                            )}
                        </div>

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
            </div>
        </>
    );
};

export default AddBook;
