import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Header = () => {
  const { hotelId } = useParams(); // Get hotel id from the URL if available

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('auth_token');

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    navigate('/signin'); // Use React Router's navigate method
  };

  return (
    <div className="bg-blue-800 py-6 ">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">TechHolidays.com</Link>
        </span>
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link to={`/hotel/${hotelId}/booking`} className="text-white hover:text-green-500">
                My Bookings
              </Link>
              <Link to="/my-hotels" className="text-white hover:text-green-500">
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
