import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import axios from 'axios';
import { MdDeleteOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { GiClick } from 'react-icons/gi';

const Dashboard = () => {
    const [books, setBooks] = useState([]);
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
    return (
        <>
            <Navbar/>
            
            <main className="flex-grow h-screen">
                <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Find Your Book</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {books.length > 0 ? (
                        books.map(item => (
                            <div
                                key={item.id}
                                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                                <p className='mb-3'>{item.content}</p>

                                {token && (
                                    <>
                                        <Link 
                                            type='button'
                                            to={`/details-book/${item.id}`}
                                            className='px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white transition duration-100 rounded-lg me-1'
                                        >
                                            <GiClick/>
                                        </Link>
                                        <Link 
                                            type='button'
                                            onClick={() => handleDelete(item.id)}
                                            className='px-4 py-2 bg-red-700 hover:bg-red-800 text-white transition duration-100 rounded-lg'>
                                            <MdDeleteOutline/>
                                        </Link>
                                    </>
                                )}
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