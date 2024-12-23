
import React from 'react'
import { HotelType } from '../config/hotelConfig'
import { Link } from 'react-router-dom'

type Props = {
    hotel: HotelType
}

const LatestDestinationCard = ({hotel}: Props) => {
  return (
    <Link to={`/detail/${hotel._id}`} className="relative cursor-pointer rounded-md">
        <div className="h-[300px]">
            <img src={hotel.imageUrls[0]} alt=""
            className='w-full h-full object-cover object-center'
             />
        </div>

        <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-md">
            <span className='text-white font-bold tracking-tight text-3xl'>
                {hotel.name}
            </span>
        </div>
      
    </Link>
  )
}

export default LatestDestinationCard
