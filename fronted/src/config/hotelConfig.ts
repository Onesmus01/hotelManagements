export const hotelTypes = [
    "Budget",
    "Boutique",
    "Luxury",
    "Ski Resort",
    "Business",
    "Family",
    "Romantic",
    "hiking Resort",
    "cabin",
    "Beach Resort",
    "Golf resort",
    "Hotel",
    "All inclusive",
    "pet Friendly",
    "self catering"
]

export const hotelFacilities = [
    "Free Wifi",
    "Parking",
    "Airport Shuttle",
    "Family Rooms",
    "Non-smoking Rooms",
    "Outdoor Pool",
    "Spa",
    "Fitness Center"

]

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export type HotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    lastUpdated: Date;
    bookings: BookingType[]

}

export type paymentIntentResponse = {
    paymentIntentId: string
    clientSecret: string
    totalCost: number
}

export type BookingType = {
    _id: string
    userId: string
    firstName: string
    lastName: string
    email: string
    adultCount: number
    childCount: number
    checkIn: Date
    checkOut: Date
    totalCost: number
}