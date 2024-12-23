import { format } from "date-fns";
import { HotelType } from "../config/hotelConfig";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType; 
};

const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  if (!hotel) {
    return (
      <div className="text-red-500 text-center">
        <p>Hotel details are unavailable. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit shadow-md">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b py-2">
        <p className="text-gray-700">Location:</p>
        <span className="font-bold">
          {`${hotel.name || "N/A"}, ${hotel.city || "N/A"}, ${hotel.country || "N/A"}`}
        </span>
      </div>
      <div className="border-b py-2">
        <p className="text-gray-700">Check-in:</p>
        <span className="font-bold">{format(checkIn, "PPP")}</span>
      </div>
      <div className="border-b py-2">
        <p className="text-gray-700">Check-out:</p>
        <span className="font-bold">{format(checkOut, "PPP")}</span>
      </div>
      <div className="border-b py-2">
        <p className="text-gray-700">Number of Nights:</p>
        <span className="font-bold">{numberOfNights}</span>
      </div>
      <div className="border-b py-2">
        <p className="text-gray-700">Guests:</p>
        <span className="font-bold">
          {adultCount} Adults, {childCount} Children
        </span>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
