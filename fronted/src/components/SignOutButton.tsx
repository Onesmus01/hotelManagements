import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // API call to log out the user
      const response = await axios.post('http://localhost:7000/api/user/signout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.status === 200) {
        localStorage.removeItem('auth_token');
        toast.success('Logged out successfully')

        navigate('/signin');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white rounded-full"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
