import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookDetails = () => {
    const { id } = useParams(); // Get book ID from URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Track editing state
    const [editedContent, setEditedContent] = useState(''); // Store edited content

    // Fetch book details
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/books/${id}`);
                if (!response.ok) throw new Error('Failed to fetch book details');

                const data = await response.json();
                setBook(data);
                setEditedContent(data.content); // Initialize content for editing
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    // Handle Edit Click
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Handle Save Click
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id"); // Ensure userId is correctly retrieved
    
            console.log("Updating book:", { id, title: book.title, content: editedContent, userId });
    
            if (!userId || userId === "undefined") {
                throw new Error("User ID is missing from localStorage.");
            }
    
            // Ensure userId is included in the update request
            const updatedData = {
                title: book.title,
                content: editedContent,
                userId: parseInt(userId, 10), // Convert userId to an integer
            };
    
            const response = await fetch(`http://localhost:3001/books/${id}`, {
                method: 'PUT', // Use PUT method for updates
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
    
            if (!response.ok) throw new Error('Failed to update content');
    
            const updatedBook = await response.json();
            setBook(updatedBook.mysqlData); // Update state with new content
            setIsEditing(false); // Exit editing mode
        } catch (err) {
            setError(err.message);
        }
    }

    // Handle Cancel Click
    const handleCancel = () => {
        setEditedContent(book.content); // Reset to original content
        setIsEditing(false); // Exit editing mode
    };

    if (loading) return <div className="text-center text-gray-500 mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    if (!book) return <div className="text-center text-gray-500 mt-10">No book found</div>;

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-2xl w-full p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

                    {/* Content Section */}
                    {isEditing ? (
                        <textarea
                            className="w-full mt-4 p-3 border border-gray-300 rounded-lg"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows="5"
                        />
                    ) : (
                        <p className="text-gray-500 mt-2 italic">{book.content}</p>
                    )}

                    {/* Book Details */}
                    <div className="mt-4 text-gray-700 space-y-2">
                        <p className="font-medium">
                            <span className="text-gray-900">Author:</span> 
                        </p>
                        <p className="font-medium">
                            <span className="text-gray-900">Published:</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end space-x-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default BookDetails;
