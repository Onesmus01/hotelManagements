import { HotelType, paymentIntentResponse, UserType } from '../config/hotelConfig';
import { BookingFormData } from '../forms/BookingForm/BookingForm';
import { RegisterFormData } from './pages/Register';
import axios from 'axios';


//         const response = await axios.post(
//             'http://localhost:7000/api/user/register',
//             formData,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         // Axios automatically parses JSON response data
//         return response.data;
//     } catch (error: any) {
//         console.error('Error during registration:', error);

//         // Check if error has a response from the server
//         if (error.response?.data?.message) {
//             throw new Error(error.response.data.message);
//         }
        
//         throw new Error('Failed to register');
//     }
// };
export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number
    }
}

export const AddMyHotel = async (hotelFormData: FormData, reset: () => void): Promise<any> => {
    try {
        const response = await fetch('http://localhost:7000/api/hotel/my-hotels', {
            method: "POST",
            credentials: "include",
            body: hotelFormData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add hotel");
        }

        const data = await response.json();
        window.location.reload(); // Reload the page

        return data;
    } catch (error: any) {
        console.error("Error adding hotel:", error);
        throw new Error("Failed to add hotel");
    }
};
export const fetchMyHotels = async (): Promise<HotelType[]> => {
    try {
        const response = await fetch("http://localhost:7000/api/hotel/hotels/getHotel", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json().catch(() => ({}));
            console.error("Error fetching hotels:", errorDetails);
            throw new Error(`Error fetching hotels: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error("Invalid response format: Expected an array");
        }

        return data;
    } catch (error) {
        console.error("FetchMyHotels Error:", error);
        throw error;
    }
};

// export const fetchMyHotels = async (): Promise<HotelType[]>=> {
//     const response = await fetch("http://localhost:7000/api/hotel/getHotel",{
//         credentials: "include",
//     })
//     if(!response.ok) {
//         throw new Error("Error fetching hotels")
//     }
//     return response.json()
// }

export const fetchMyHotelsById = async(hotelId: string): Promise<HotelType>=> {
    const response = await fetch(`http://localhost:7000/api/hotel/${hotelId}`,{
        credentials: "include",
    })
    if(!response.ok) {
        throw new Error("Error fetching hotels")
    }
    return response.json()
}

export const updateMyHotelIdByid = async (hotelFormData: FormData) => {
    const response = await fetch(`http://localhost:7000/api/hotel/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        body: hotelFormData,
        credentials: "include",
    });

    // Log the response for debugging
    const responseBody = await response.text(); // Read the response body as text
    console.log("Response body:", responseBody); // Log it to inspect it

    if (!response.ok) {
        throw new Error(`Failed to update Hotel: ${responseBody}`);
    }

    return JSON.parse(responseBody); // Parse the response as JSON
};



export type SearchParams = {
    destination: string;
    checkIn: string;
    checkOut: string;
    adultCount: string;
    childCount: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
};

export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    // Create a new URLSearchParams object to hold query parameters
    const queryParams = new URLSearchParams();

    // Add properties that are optional, ensuring we only add them if they exist
    if (searchParams.maxPrice) queryParams.append("maxPrice", searchParams.maxPrice);
    if (searchParams.sortOption) queryParams.append("sortOption", searchParams.sortOption);

    // For arrays like facilities, types, and stars, append each item individually
    if (searchParams.facilities) {
        searchParams.facilities.forEach((facility) => queryParams.append("facilities", facility));
    }

    if (searchParams.types) {
        searchParams.types.forEach((type) => queryParams.append("types", type));
    }

    if (searchParams.stars) {
        searchParams.stars.forEach((star) => queryParams.append("stars", star));
    }

    // Add the rest of the parameters if they exist
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value && key !== 'facilities' && key !== 'types' && key !== 'stars') {
            queryParams.append(key, value);
        }
    });

    // Construct the final URL with query parameters
    const url = `http://localhost:7000/api/searchHotel/search?${queryParams.toString()}`;

    try {
        // Fetch data from the backend
        const response = await fetch(url);

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error fetching hotels: ${response.status} ${response.statusText} - ${errorDetails}`);
        }

        // Return the parsed JSON response
        return await response.json();

    } catch (error) {
        console.error("Error in searchHotels:", error);
        throw error; // Rethrow error to be handled by the calling code
    }
};

export const fetchHotelById = async (hotelId: string) => {
    if (!hotelId) {
        console.error("Hotel ID is required but not provided");
        throw new Error("Hotel ID is required but not provided");
    }

    console.log("Fetching hotel with ID:", hotelId); // Log the hotel ID and URL

    const url = `http://localhost:7000/api/hotel/${hotelId}`;
    console.log("Request URL:", url); // Log the URL for debugging

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorDetail = await response.text();
            console.error("Failed to fetch hotel. Status:", response.status, "Response:", errorDetail);
            throw new Error(`Error fetching hotel details: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error during fetch operation:", error);
        throw new Error("Network error occurred while fetching hotel details");
    }
};

  
export const fetchCurrentUser = async(): Promise<UserType> => {
    const response = await fetch('http://localhost:7000/api/user/me', {
        credentials: 'include',
    })
    if(!response.ok) {
        throw new Error("Error fetching user")
    }
    return response.json()
}

// export type paymentIntentResponse = {
//     paymentIntentId: string
//     clientSecret: string
//     totalCost: number
// }


export const createPaymentIntent = async(hotelId: string,numberOfNights: string): Promise<paymentIntentResponse> => {
    const response = await fetch(`http://localhost:7000/api/hotel/${hotelId}/bookings/payment-intent`,{
        credentials: "include",
        method: "POST",
        body:JSON.stringify({numberOfNights}),
        headers: {
            "content-Type": "application/json",
        }
    })
    if(!response.ok) {
        throw new Error("Error fetching payment Intent")
    }
    return response.json()
}

export const createRoomBooking = async(formData: BookingFormData) => {
    const response = await fetch(`http://localhost:7000/${formData.hotelId}/bookings`,{
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData)
    })
    if(!response.ok) {
        throw new Error( "Error booking the room")
    }
    return response.json()
}

export const fetchMyBookings = async()=> {
    const response = await fetch('http://localhost:7000/api/bookings/mybookings',{
        credentials: "include",
    })

    if(!response) {
        throw new Error("unable to fetch Bookings")
    }
    return response.json()
}

export const fetchHotels = async(): Promise<HotelType[]> => {
    const response = await fetch('http://localhost:7000/api/hotel/getAll/all')
    if(!response.ok) {
        throw new Error("Error fetching hotels")
    }

    return response.json()
}


