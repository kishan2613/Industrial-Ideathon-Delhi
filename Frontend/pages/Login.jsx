import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // You can add actual authentication logic here
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-200">
        <img
          src="https://img.freepik.com/free-photo/transport-logistics-concept_23-2151541934.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-8">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center">
            Login to continue
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter your User ID"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Login
            </button>

            {/* Continue with Google */}
            <button
              type="button"
              className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
