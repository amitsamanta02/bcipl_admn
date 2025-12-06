import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { admin_logo } from "../../../assets/assets";
import { forgotPassword } from "../../../services/apis/forgotPassword";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            setError("Please enter your email");
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email");
            return;
        }

        setLoading(true);

        try {
            const res = await forgotPassword({ email });

            if (res?.code === 0 && res?.status === "SUCCESS") {
                setSuccess("Password reset link has been sent to your email.");
            } else {
                setError(res?.message || "Something went wrong");
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong";

            setError(msg);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">

                {/* Logo */}
                <div className="text-center mb-6">
                    <img src={admin_logo} alt="logo" className="mx-auto mb-3" style={{ width: "180px" }} />
                    <h1 className="text-2xl font-semibold text-gray-800">Forgot Password</h1>
                    <p className="text-gray-500 text-sm">Enter your email to reset your password</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email Field */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => {
                                    setError("");
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-4 text-sm text-gray-600">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-blue-600 hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;