import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Optional: Client-side validation (e.g., matching passwords)

    // Call your backend API here
    // const response = await fetch('/api/register', { ... });

    // After successful signup
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[900px] rounded-2xl shadow-xl overflow-hidden">
        {/* Form Section */}
        <div className="w-1/2 bg-white p-10">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-sm text-gray-500 mb-6">Join us and manage your deliveries effortlessly.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md">
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account? <a href="/" className="text-purple-600 hover:underline">Log in</a>
          </p>
        </div>

        {/* Branding Section */}
        <div className="w-1/2 bg-purple-600 text-white flex flex-col justify-center items-center p-10">
          <div className="text-3xl font-bold mb-4">FoodDeliveryApp</div>
          <p className="text-lg text-center">Deliver Smarter. Track Easier.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;