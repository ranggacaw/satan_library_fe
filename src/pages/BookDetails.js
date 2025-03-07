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
    const [isSaving, setIsSaving] = useState(false);

    // Fetch book details
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const headers = { 'Content-Type': 'application/json' };
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(`http://localhost:3001/books/${id}`, {
                    method: "GET",
                    headers
                });
    
                if (!response.ok) throw new Error('Failed to fetch book details');
    
                const data = await response.json();
                setBook(data);
                setEditedContent(data.content || ""); // Initialize content for editing
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBookDetails();
    }, [id, token]); // Added token to dependencies

    // Handle Edit Click
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Handle Save Click
    const handleSave = async () => {
        setIsSaving(true);
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
                imageUrl: book.imageUrl, // Keep existing imageUrl
                userId: parseInt(userId, 10), // Convert userId to an integer
            };
    
            const response = await fetch(`http://localhost:3001/books/${id}`, {
                method: 'PATCH', // Use PUT method for updates
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
        } finally {
            setIsSaving(false);
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
                <div className="max-w-6xl w-full bg-white shadow-2xl rounded-xl border border-gray-300 relative p-8">
                    {/* Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Image */}
                        <div className="flex items-center justify-center">
                            {book.imageUrl ? (
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
                                    onError={() => console.error("Failed to load image")} // Fallback if image fails to load
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 rounded-lg">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Right Column: Content */}
                        <div className="flex flex-col justify-between">
                            {/* Book Title */}
                            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                                {book.title}
                            </h1>

                            {/* Content Section (Reading Mode) */}
                            <div className="bg-gray-50 p-6 rounded-md shadow-inner">
                                {isEditing ? (
                                    <textarea
                                        className="w-full h-screen p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                <p>
                                    <span className="font-semibold text-gray-900">Author:</span>{" "}
                                    {book.author || "Unknown"}
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-900">Published:</span>{" "}
                                    {book.publishedDate || "Not available"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Bookmark Edit Button */}
                    <div className="absolute top-5 right-5">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="btn btn-success mr-2 shadow-md"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save"}
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
