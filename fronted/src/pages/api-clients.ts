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

export const updateMyHotelIdByid = async (hotelFormData: FormData)=> {
    const response = await fetch(`http://localhost:7000/api/hotel/${hotelFormData.get("hotelId")}`,{
        method: "PUT",
        body: "hotelFormData",
        credentials: "include"
    })
    if(!response.ok){
        throw new Error("Failed to update Hotel")
    }
    return response.json()
}

export type SearchParams = {
    destination: string;
    checkIn: string;
    checkOut: string;
    adultCount: string;
    childCount: string;
    page: string;
};

export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
            queryParams.append(key, value);
        }
    });

    const response = await fetch(`http://localhost:7000/api/searchHotel/search?${queryParams}`);

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error fetching hotels: ${response.status} ${response.statusText} - ${errorDetails}`);
    }

    return await response.json(); // Return the parsed JSON response
};
