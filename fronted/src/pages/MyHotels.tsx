import React from 'react';
import { Link } from 'react-router-dom';
import * as apiClient from './api-clients';
import { useQuery } from 'react-query';
import { BsMap, BsBuilding } from 'react-icons/bs';
import { BiMoney, BiHotel } from 'react-icons/bi';
import { AiFillStar } from 'react-icons/ai'; 

const MyHotels = () => {
  const { data: hotelData, isLoading, isError } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: (error) => {
      console.error("Error fetching hotels:", error);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-medium text-gray-700">Loading...</span>
      </div>
    );
  }

  if (isError || !hotelData || hotelData.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-medium text-gray-700">No Hotels Found</span>
      </div>
    );
  }

  const renderStars = (starRating) => {
    return Array.from({ length: starRating }, (_, index) => (
      <AiFillStar key={index} className="text-yellow-500" />
    ));
  };

  return (
    <div className="p-5 space-y-8 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center bg-white p-5 shadow rounded-md">
        <h1 className="text-3xl font-extrabold text-gray-800">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition duration-200"
        >
          Add Hotel
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
              <p className="text-gray-600 text-sm whitespace-pre-line">{hotel.description}</p>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <BsMap className="text-blue-600" />
                  <span>
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <BsBuilding className="text-blue-600" />
                  <span>{hotel.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <BiMoney className="text-blue-600" />
                  <span>${hotel.pricePerNight} per Night</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <BiHotel className="text-blue-600" />
                  <span>
                    {hotel.adultCount} Adults, {hotel.childCount} Children
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  {renderStars(hotel.starRating)}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-5 border-t">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
