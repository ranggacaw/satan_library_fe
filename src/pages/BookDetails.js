import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BookDetails = () => {
    const { id } = useParams(); // Get book ID from URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Track editing state
    const [editedContent, setEditedContent] = useState(''); // Store edited content
    const token = localStorage.getItem("token");

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

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
                <div className="max-w-3xl w-full bg-white shadow-2xl rounded-xl border border-gray-300 relative p-8">
                    
                    {/* Book Cover */}
                    {book.coverImage && (
                        <div className="w-full h-64 bg-gray-200 rounded-md overflow-hidden mb-6 shadow-lg">
                            <img 
                                src={book.coverImage} 
                                alt={book.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Book Title */}
                    <h1 className="text-4xl font-serif font-bold text-gray-900">
                        {book.title}
                    </h1>

                    {/* Content Section (Reading Mode) */}
                    <div className="mt-6 bg-gray-50 p-6 rounded-md shadow-inner">
                        {isEditing ? (
                            <textarea
                                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                        ) : (
                            <p className="text-lg leading-relaxed text-gray-700">
                                {book.content}
                            </p>
                        )}
                    </div>

                    {/* Book Details */}
                    <div className="mt-6 text-gray-700 text-sm space-y-2 italic">
                        <p><span className="font-semibold text-gray-900">Author:</span> {book.author || "Unknown"}</p>
                        <p><span className="font-semibold text-gray-900">Published:</span> {book.publishedDate || "Not available"}</p>
                    </div>

                    {/* Floating Bookmark Edit Button */}
                    <div className="absolute top-5 right-5">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="btn btn-success mr-2 shadow-md"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="btn btn-neutral shadow-md"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : token ? (
                            <button
                                onClick={handleEdit}
                                className="btn btn-primary shadow-md"
                            >
                                Edit
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookDetails;
