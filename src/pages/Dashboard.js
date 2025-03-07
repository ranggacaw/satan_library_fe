import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import BookSlider from "../components/BookSlider";

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem("token");
    const limit = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/books?page=${page}&limit=${limit}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "1",
                        Authorization: `Bearer ${token}`,
                    },
                });

                setBooks(response.data.books);
                setTotalPages(response.data.totalPages);
                console.log("Fetched books:", response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchData();
    }, [token, page]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/books/${id}`, {
                headers: {
                    "ngrok-skip-browser-warning": "1",
                    Authorization: `Bearer ${token}`,
                },
            });

            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
            console.log("Book deleted successfully.");
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.content.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="hero font-serif text-white py-24 text-center bg-[url('https://images.unsplash.com/photo-1502485019198-a625bd53ceb7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFyayUyMGxpYnJhcnl8ZW58MHx8MHx8fDA%3D')] bg-cover bg-no-repeat bg-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Satan Library</h1>
                    <p className="text-lg mb-6">Discover, explore, and read thousands of books.</p>
                    <Link
                        className="group relative inline-block text-sm font-medium text-white focus:ring-3 focus:outline-hidden"
                        to="/add-book"
                    >
                        <span className="absolute inset-0 border border-yellow-300"></span>
                        <span
                            className="block border border-black bg-yellow-300 px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 text-black"
                        >
                            Add Your Book
                        </span>
                    </Link>
                </div>
            </section>

            {/* Book Slider */}
            <BookSlider />

            {/* Search & Book List */}
            <section className="container mx-auto px-4 py-16 font-serif">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Book</h2>
                <p className="text-gray-500 mb-6 text-sm">Search and discover books that spark your interest.</p>

                <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-md p-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md mb-6"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <div key={book.id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-all flex flex-col h-full">
                                <img src={book.imageUrl} alt={book.title} className="max-h-72 object-cover rounded-md mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{book.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{book.content.substring(0, 100)}...</p>
                                <div className="mt-auto flex justify-between items-center pt-2">
                                    <Link to={`/details-book/${book.id}`} className="text-sm text-gray-800 hover:underline">
                                        Read More →
                                    </Link>
                                    {token && (
                                        <button onClick={() => handleDelete(book.id)} className="text-sm text-red-500 hover:text-red-700">
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center col-span-full">No books found.</p>
                    )}
                </div>

                <div className="flex justify-center mt-6">
                    <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn btn-secondary mx-2">
                        Prev
                    </button>
                    <span className="px-4 py-2">{page} / {totalPages}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn btn-secondary mx-2">
                        Next
                    </button>
                </div>
            </section>

            {/* Reading Matters */}
            <section className="w-full bg-gray-50 py-16 px-6 text-end font-serif">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">📚 The Power of Reading</h2>
                    <p className="text-sm text-gray-700 mb-8">
                        "A reader lives a thousand lives before he dies. The man who never reads lives only one."  
                        <span className="block mt-2 font-medium text-gray-900">— George R.R. Martin</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Expands Knowledge</h3>
                            <p className="text-gray-600 text-sm">
                                Books open doors to new ideas, cultures, and perspectives, enriching your understanding of the world.
                            </p>
                        </div>

                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Strengthens the Mind</h3>
                            <p className="text-gray-600 text-sm">
                                Reading enhances focus, memory, and critical thinking—keeping your brain sharp and active.
                            </p>
                        </div>

                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Inspires Creativity</h3>
                            <p className="text-gray-600 text-sm">
                                Every book holds the power to spark imagination, fuel creativity, and inspire new possibilities.
                            </p>
                        </div>
                    </div>

                    <p className="mt-10 text-lg text-gray-800 font-medium">
                        Start your next adventure—one page at a time.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default HomePage;
