import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Please check your email for reset password.");
            Swal.fire({
                title: "Email sent!",
                text: "Check your email for reset password.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            setMessage("Error, please check you email address.");
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Email not found.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-serif">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700">Lupa Password</h2>
                {message && <p className="text-center text-green-500">{message}</p>}
                <form onSubmit={handleResetPassword} className="mt-4">
                    <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Masukkan email Anda"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-3 text-gray-700 bg-yellow-300 rounded-lg hover:bg-yellow-600"
                    >
                        Kirim Email Reset Password
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    <Link to="/login" className="text-yellow-500 hover:underline">Kembali ke Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
