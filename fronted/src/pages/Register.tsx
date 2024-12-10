import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:7000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies in requests
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to register');
      }

      const result = await response.json();

      if (result.token) {
        console.log('Received token:', result.token); 
        localStorage.setItem('auth_token', result.token);
      } else{
        toast.error(result.message || 'not Autorized')
      }

      toast.success(result.message || 'Registration successful');
      navigate('/'); // Navigate to the desired page
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-6 bg-white shadow-lg rounded-lg p-6 w-[700px] mx-auto mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-3xl font-bold text-center mb-4">Create an Account</h2>

      {/* First and Last Name */}
      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex-1">
          <span className="block text-gray-700 text-sm font-bold mb-1">First Name</span>
          <input
            className="border rounded w-full py-2 px-3 text-sm"
            {...register('firstName', { required: 'First Name is required' })}
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs">{errors.firstName.message}</span>
          )}
        </label>
        <label className="flex-1">
          <span className="block text-gray-700 text-sm font-bold mb-1">Last Name</span>
          <input
            className="border rounded w-full py-2 px-3 text-sm"
            {...register('lastName', { required: 'Last Name is required' })}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs">{errors.lastName.message}</span>
          )}
        </label>
      </div>

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

      {/* Confirm Password */}
      <label>
        <span className="block text-gray-700 text-sm font-bold mb-1">Confirm Password</span>
        <input
          type="password"
          className="border rounded w-full py-2 px-3 text-sm"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value, formValues) =>
              value === formValues.password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
        )}
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-4"
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account? 
          <Link to='/signin'
            className="text-blue-600 cursor-pointer hover:underline"
          >
            login
          </Link>
        </p>
      </div>

    </form>
  );
};

export default Register;
