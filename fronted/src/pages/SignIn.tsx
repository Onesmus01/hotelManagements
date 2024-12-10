import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);

      // Make POST request with axios
      const response = await axios.post(
        'http://localhost:7000/api/user/signin',
        data,  // Pass data directly
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      // Check for successful response
      const result = response.data; // Axios automatically parses JSON

      if (result.token) {
        console.log('Received token:', result.token);
        localStorage.setItem('auth_token', result.token);
        toast.success(result.message || 'Sign in successful');
        navigate('/'); // Redirect to home or dashboard
      } else {
        toast.error(result.message || 'Not authorized');
      }
    } catch (error: any) {
      // Handle errors (check if it's axios error)
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error(error.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-6 bg-white shadow-lg rounded-lg p-6 w-[700px] mx-auto mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-3xl font-bold text-center mb-4">Sign In</h2>

      {/* Email */}
      <label>
        <span className="block text-gray-700 text-sm font-bold mb-1">Email</span>
        <input
          type="email"
          className="border rounded w-full py-2 px-3 text-sm"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </label>

      {/* Password */}
      <label>
        <span className="block text-gray-700 text-sm font-bold mb-1">Password</span>
        <input
          type="password"
          className="border rounded w-full py-2 px-3 text-sm"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-4"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account? 
          <Link to='/register'
            className="text-blue-600 cursor-pointer hover:underline"
          >
            signup
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignIn;
