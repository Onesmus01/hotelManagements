import React from 'react';
import { Link } from 'react-router-dom';
import AddHotel from '../pages/AddHotel';

const Header = () => {
  const isLoggedIn = !!localStorage.getItem('auth_token');

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/signin'; // Redirect to sign-in page
  };
  

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">TechHolidays.com</Link>
        </span>
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/my-bookings" className="text-white hover:text-green-500">
                My Bookings
              </Link>
              <Link to="/add-hotels" className="text-white hover:text-green-500">
                My Hotels
              </Link>
              <button 
                onClick={handleSignOut} 
                className="text-white hover:text-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              to="/signin" 
              className="flex items-center text-gray-600 bg-white rounded-full px-3 font-bold hover:bg-gray-100 hover:text-green-500"
            >
              Sign In 
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
