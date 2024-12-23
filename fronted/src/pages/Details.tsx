import React from 'react';
import { useParams } from "react-router-dom";
import * as apiClient from "./api-clients";
import { AiFillStar } from 'react-icons/ai';
import { useQuery } from 'react-query';
import GuestInfoForm from '../forms/GuestInfoForm/GuestInfo/GuestInfoForm';

const Details = () => {
    const { hotelId } = useParams();

    const { data: hotel, isLoading, error } = useQuery(
        "fetchHotelById", 
        () => apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId ,
        }
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !hotel) {
        return <div>Hotel not found</div>;
    }

    return (
        <div className='space-y-6'>
            <div className="">
                <span className="flex">
                    {Array.from({ length: hotel.starRating }).map((_, index) => (
                        <AiFillStar className='fill-yellow-400' key={index} />
                    ))}
                </span>
                <h1 className='text-3xl font-bold'>{hotel.name}</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-1 gap-4">
                {hotel.imageUrls.map((image) => (
                    <div key={image} className="h-[300px]">
                        <img src={image} alt={hotel.name} className='rounded-md w-full h-full object-cover object-center' />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {hotel.facilities.map((facility) => (
                    <div key={facility} className="border border-slate-300 rounded-sm p-3">
                        {facility}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
                <div className="whitespace-pre-line">{hotel.description}</div>
                <div className="h-fit">
                    <GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id} />
                </div>
            </div>
        </div>
    );
};

export default Details;
