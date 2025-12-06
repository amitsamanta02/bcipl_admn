import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { admin_logo } from "../../../assets/assets";
import { resetPassword } from "../../../services/apis/resetPassword";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get token from URL → /reset-password?token=12345
    const token = new URLSearchParams(location.search).get("token");
    // console.log(token)
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newPassword || !confirmPassword) {
            setError("Please fill in both fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!token) {
            setError("Invalid or expired reset link");
            return;
        }

        setLoading(true);
        console.log(token, "token before api call")
        console.log(newPassword, "newPassword before api call")

        try {
            const res = await resetPassword({
                token,
                newPassword,
            });

            if (res?.code === 0 && res?.status === "SUCCESS") {
                setSuccess("Your password has been reset successfully!");

                // Auto redirect after success
                setTimeout(() => navigate("/login"), 2000);
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
                    <h1 className="text-2xl font-semibold text-gray-800">Reset Password</h1>
                    <p className="text-gray-500 text-sm">Create a new password for your account</p>
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

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* New Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type={showPassword1 ? "text" : "password"}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => {
                                    setError("");
                                    setNewPassword(e.target.value);
                                }}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-600"
                                onClick={() => setShowPassword1(!showPassword1)}
                            >
                                {showPassword1 ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type={showPassword2 ? "text" : "password"}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setError("");
                                    setConfirmPassword(e.target.value);
                                }}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-600"
                                onClick={() => setShowPassword2(!showPassword2)}
                            >
                                {showPassword2 ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                                Updating...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

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

export default ResetPassword;