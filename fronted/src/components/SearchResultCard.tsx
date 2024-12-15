import React from 'react';
import { HotelType } from '../shared/Types';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';

type Props = {
    hotel: HotelType;
};

const SearchResultCard = ({ hotel }: Props) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-[2fr_3fr] border border-gray-300 rounded-lg p-4 gap-4 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-tl from-gray-100 via-gray-200 to-gray-300'>
            {/* Image Section */}
            <div className="w-full h-[250px] max-h-[250px] overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105">
                <img
                    src={hotel.imageUrls?.[0] || '/placeholder.jpg'}
                    alt={hotel.name || 'Hotel image'}
                    className='w-full h-full object-cover object-center'
                />
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between">
                {/* Header */}
                <div className="mb-3">
                    <div className="flex items-center mb-2">
                        {/* Star Rating */}
                        <span className="flex">
                            {Array.from({ length: Math.floor(hotel.starRating || 0) }).map((_, index) => (
                                <AiFillStar key={index} className='fill-yellow-500 text-sm' />
                            ))}
                        </span>
                        <span className="ml-2 text-sm text-gray-800">{hotel.type || "Unknown type"}</span>
                    </div>
                    {/* Hotel Name */}
                    <Link
                        to={`/detail/${hotel._id}`}
                        className='text-xl font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300'
                    >
                        {hotel.name || "Unnamed Hotel"}
                    </Link>
                </div>

                {/* Description */}
                <div className="overflow-hidden mb-3">
                    <p className="text-gray-800 sm:text-sm md:text-base line-clamp-3 md:line-clamp-none">
                        {hotel.description || "No description available."}
                    </p>
                </div>

                {/* Facilities and Price Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {hotel.facilities && hotel.facilities.length > 0 ? (
                            hotel.facilities.slice(0, 3).map((facility, index) => (
                                <span
                                    key={`${facility}-${index}`}
                                    className="bg-gray-300 p-1 rounded-lg text-xs text-gray-800 hover:bg-gray-400 transition-all duration-300"
                                >
                                    {facility}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500">No facilities listed</span>
                        )}
                        {hotel.facilities?.length > 3 && (
                            <span className="text-sm text-gray-700">
                                +{hotel.facilities.length - 3} more
                            </span>
                        )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-lg text-green-700">${hotel.pricePerNight} per night</span>
                        <Link
                            to={`/detail/${hotel._id}`}
                            className='bg-blue-600 text-white px-4 py-2 text-lg font-bold rounded-lg hover:bg-blue-500 transition-all duration-300'
                        >
                            View more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultCard;
