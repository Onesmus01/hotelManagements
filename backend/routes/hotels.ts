import mongoose from 'mongoose';

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: string;
  facilities: string[];
  pricePerNight: number;
  imageUrls: string[];
  lastUpdated: Date;
}
const hotelSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    facilities: {type: String,required: true},
    pricePerNight: { type: Number, required: true },
    starRating: { type: Number, required: true },
    imageUrls: { type: String, required: true },  // Array of strings for multiple images
    lastUpdated: { type: Date, required: true },   // Changed to Date type
  },
  { timestamps: true }
);
const Hotel = mongoose.model<HotelType>("Hotel",hotelSchema)


export default Hotel;
