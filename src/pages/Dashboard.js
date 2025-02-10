import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const token = localStorage.getItem('token');

    // Fetching data dari API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/books', 
                    { headers: 
                        {
                            'ngrok-skip-browser-warning': '1', // Additional header
                            Authorization: `Bearer ${token}`, // Bearer token
                        }, 
                    }
                );

                // Ngecheck response data
                console.log("response data", response.data);
                
                // Pastiin data adalah array
                setBooks(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("error fetching data", error);
            }
        }

        fetchData();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token')

            const response = await axios.delete(`http://localhost:3001/books/${id}`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': '1', // Additional header
                        Authorization: `Bearer ${token}`, // Bearer token
                    }
                }
            )

            // Remove the deleted book from the UI
            setBooks(prevData => prevData.filter(book => book.id !== id));

            console.log("Book deleted successfully:", response.data);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    // Filter books based on search query
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Navbar/>
            
            <main className="flex flex-col min-h-screen">
                <div className="flex-grow container mx-auto px-4 py-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Find Your Book</h2>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-14"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                                >
                                    {/* Title & Content */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                                        <p className="mb-3">{item.content}</p>
                                    </div>

                                    {/* Footer: Buttons always at the bottom */}
                                    <div className="mt-auto flex justify-between items-center pt-4">
                                        <Link 
                                            to={`/details-book/${item.id}`}
                                            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white transition duration-100 rounded-lg"
                                        >
                                            Read More
                                        </Link>
                                        
                                        {token && (
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white transition duration-100 rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p className="text-gray-500 text-center col-span-full">
                                No content available.
                            </p>
                        )}
                    </div>
                </div>
            </main>

            <Footer/>
        </>
    )
}

export default Dashboard