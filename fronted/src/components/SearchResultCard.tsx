import React from 'react';
import { HotelType } from '../shared/Types';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';

type Props = {
    hotel: HotelType;
};

const SearchResultCard = ({ hotel }: Props) => {
    return (
        <div className='grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8 shadow-lg hover:shadow-xl transition-all duration-300'>
            {/* Image Section */}
            <div className="w-full h-[300px] max-h-[300px] overflow-hidden rounded-lg">
                <img
                    src={hotel.imageUrls?.[0] || '/placeholder.jpg'}
                    alt={hotel.name || 'Hotel image'}
                    className='w-[5] h-full object-contain object-center'
                />
            </div>

            {/* Details Section */}
            <div className="grid grid-rows-[1fr_2fr_1fr] gap-2">
                {/* Header */}
                <div>
                    <div className="flex items-center mb-2">
                        {/* Star Rating */}
                        <span className="flex">
                            {Array.from({ length: Math.floor(hotel.starRating || 0) }).map((_, index) => (
                                <AiFillStar key={index} className='fill-yellow-400' />
                            ))}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">{hotel.type || "Unknown type"}</span>
                    </div>
                    {/* Hotel Name */}
                    <Link
                        to={`/detail/${hotel._id}`}
                        className='text-2xl font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300'
                    >
                        {hotel.name || "Unnamed Hotel"}
                    </Link>
                </div>

                {/* Description */}
                <div>
                    <p className="line-clamp-4 text-gray-700">{hotel.description || "No description available."}</p>
                </div>

                {/* Facilities and Price Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {hotel.facilities && hotel.facilities.length > 0 ? (
                            hotel.facilities.slice(0, 3).map((facility, index) => (
                                <span
                                    key={`${facility}-${index}`} // Use facility and index as key
                                    className="bg-slate-300 p-2 rounded-lg text-xs whitespace-nowrap text-gray-700"
                                >
                                    {facility}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500">No facilities listed</span>
                        )}
                        {hotel.facilities?.length > 3 && (
                            <span className="text-sm text-gray-600">
                                +{hotel.facilities.length - 3} more
                            </span>
                        )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-lg text-gray-800">${hotel.pricePerNight} per night</span>
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
