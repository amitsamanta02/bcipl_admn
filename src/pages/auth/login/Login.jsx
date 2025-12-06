import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { admin_logo } from "../../../assets/assets";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/reducers/authSlice";
import { loginUser } from "../../../services/apis/loginUser";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ---------------- Validation ----------------
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const payload = { email, password };

      const res = await loginUser(payload);

      if (res?.code === 0 && res?.status === "SUCCESS") {
        const accessToken = res?.metaData?.accessToken;
        const refreshToken = res?.metaData?.refreshToken;

        // Save token in Redux
        dispatch(
          setUser({
            accessToken: accessToken,
            refreshToken: refreshToken
          })
        );

        // navigate("/home");
      } else {
        setError(res?.message || "Login failed");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      setError(msg);
    } finally {
      setIsLoading(false);
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <img src={admin_logo} alt="logo" className="mx-auto mb-3" style={{ width: "180px" }} />
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to your admin account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />

              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;