import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const BookSlider = () => {
    const [books, setBooks] = useState([]);
    const token = localStorage.getItem("token");

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
    };

    useEffect(() => {        
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/books`, {
                    headers: {
                        "ngrok-skip-browser-warning": "1",
                        Authorization: `Bearer ${token}`,
                    },
                });

                setBooks(response.data.books);
                console.log("Fetched books:", response.data.books);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }

        fetchData();
    }, [token]);

    return (
        <section className="py-12 bg-gray-950 font-serif">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-white text-center mb-2">Featured Books</h2>
                <p className="text-gray-400 text-center">Discover our handpicked selection of must-read books.</p>
                {books.length > 0 ? (
                    <Slider {...settings}>
                        {books.slice(0, 4).map((book) => (
                        <div key={book.id} className="p-4">
                            <div className="bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-lg font-semibold text-white mb-2">{book.title}</h3>
                                <p className="text-gray-400 mb-3">{book.content.substring(0, 80)}...</p>
                                <Link to={`/details-book/${book.id}`} className="text-yellow-300 hover:underline">
                                    Read More →
                                </Link>
                            </div>
                        </div>
                        ))}
                    </Slider>
                ) : (
                    <p className="text-gray-500">No featured books available.</p>
                )}
            </div>
        </section>
    )
}

export default BookSlider