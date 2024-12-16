import { HotelType } from '../shared/Types';
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

export const fetchMyHotels = async (): Promise<HotelType[]>=> {
    const response = await fetch("http://localhost:7000/api/hotel/getHotels",{
        credentials: "include",
    })
    if(!response.ok) {
        throw new Error("Error fetching hotels")
    }
    return response.json()
}

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

export const fetchHotelById = async(hotelId: string) => {
    const response= await fetch(`http://localhost:7000/api/searchHotel`)
}