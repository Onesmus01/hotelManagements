
import React from 'react'
import { Link } from 'react-router-dom'

const MyHotels = () => {
  return (
    <div className='space-y-5'>
        <span className='flex justify-between'>
            <h1 className='text-3xl font-bold'>My Hotels</h1>
            <Link to='/add-hotels' className='flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500' >
             Add Hotel
            </Link>
        </span>

    </div>
  )
}

export default MyHotels