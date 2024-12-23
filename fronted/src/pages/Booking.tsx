
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import * as apiClient from './api-clients'
import BookingDetailsSummary from '../components/BookingDetailsSummary'
import BookingForm from '../forms/BookingForm/BookingForm'
import { useSearchContext } from '../context/SearchContext'
import { useParams } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { useAppContext } from '../context/AppContext'

const Booking = () => {
    const {stripePromise} = useAppContext()

    const search = useSearchContext()
    const {hotelId} = useParams()

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / 
            (1000 * 60 * 60 * 24);
            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    const {data: paymentIntentData} = useQuery("createPaymentIntent",()=> 
    apiClient.createPaymentIntent(hotelId as string,numberOfNights.toString()),
    {
        enabled: !!hotelId && numberOfNights > 0
    }
    )


    const { data: hotel } = useQuery("fetchHotelByID",
        ()=> apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId,
        }
    )


    const {data:currentUser} = useQuery(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser
    )
  return (

    <div className='grid md:grid-cols-[1fr_2fr]'>
    <BookingDetailsSummary 
              checkIn={search.checkIn}
              checkOut={search.checkOut}
              adultCount={search.adultCount}
              childCount={search.childCount}
              numberOfNights={numberOfNights} hotel={{
                  _id: '',
                  userId: '',
                  name: '',
                  city: '',
                  country: '',
                  description: '',
                  type: '',
                  adultCount: 0,
                  childCount: 0,
                  facilities: [],
                  pricePerNight: 0,
                  starRating: 0,
                  imageUrls: [],
                  lastUpdated: undefined
              }}    />
              {currentUser && paymentIntentData && (
                    <Elements
                    stripe={stripePromise}
                    options={{
                    clientSecret: paymentIntentData.clientSecret,
                    }}
                    >
                    <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                    </Elements>
)}    
      
    </div>
  )
}

export default Booking



























// import { useQuery } from 'react-query';
// import * as apiClient from './api-clients';  // Assuming you have these functions defined in api-clients.ts
// import React, { useEffect, useState } from 'react';
// import BookingForm from '../forms/BookingForm/BookingForm';
// import { useSearchContext } from '../context/SearchContext';
// import { useParams } from 'react-router-dom';
// import BookingDetailsSummary from '../components/BookingDetailsSummary';

// const Booking = () => {
//     const search = useSearchContext();
//     const { hotelId } = useParams();
    
//     const [numberOfNights, setNumberOfNights] = useState<number>(0);

//     useEffect(() => {
//         if (search.checkIn && search.checkOut) {
//             const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / 
//             (1000 * 60 * 60 * 24);
//             setNumberOfNights(Math.ceil(nights));
//         }
//     }, [search.checkIn, search.checkOut]);

//     // Check if hotelId exists before fetching hotel details
//     if (!hotelId) {
//         return <div>Error: Hotel ID is missing or invalid.</div>;
//     }

//     // Fetch hotel details based on hotelId using apiClient
//     const { data: hotelResponse, isLoading: hotelLoading, error: hotelError } = useQuery(
//         ['hotel', hotelId],
//         () => apiClient.fetchHotelById(hotelId),  // API call to fetch hotel details by ID
//         {
//             enabled: !!hotelId,  // Ensure query runs only when hotelId is available
//             onError: (error: any) => {
//                 console.error("Error fetching hotel:", error);
//             }
//         }
//     );

//     // Extract hotel data
//     const hotel = hotelResponse?.data;

//     // Fetch current user details using apiClient
//     const { data: currentUser, isLoading: userLoading, error: userError } = useQuery(
//         'currentUser', 
//         apiClient.fetchCurrentUser  // API call to fetch current user details
//     );

//     // Handle loading and error states
//     if (hotelLoading || userLoading) {
//         return <div>Loading...</div>;
//     }

//     if (hotelError || userError) {
//         const errorMessage = hotelError?.message || userError?.message || "An error occurred";
//         return (
//             <div>
//                 <p>Error: {errorMessage}</p>
//                 {hotelError && <p>Status: {hotelError?.status || 'Unknown'}</p>}
//                 {userError && <p>{userError?.message}</p>}
//             </div>
//         );
//     }

//     // Optionally render BookingForm if currentUser is available
//     if (!currentUser) {
//         return <div>Please log in to book this hotel.</div>;
//     }

//     if (!hotel) {
//         return <div>Hotel not found</div>;
//     }

//     return (
//         <div className="grid md:grid-cols-[1fr_2fr]">
//             <BookingDetailsSummary 
//                 checkIn={search.checkIn}
//                 checkOut={search.checkOut}
//                 adultCount={search.adultCount}
//                 childCount={search.childCount}
//                 numberOfNights={numberOfNights}  
//             />
//             <BookingForm currentUser={currentUser} />
//         </div>
//     );
// };

// export default Booking;
