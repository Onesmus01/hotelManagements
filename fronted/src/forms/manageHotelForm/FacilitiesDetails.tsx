import React from "react";
import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotelConfig";
import { HotelFormData } from "./ManageHotelForm";

const FacilitiesDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-5 gap-3">
        {hotelFacilities.map((facility, index) => (
          <label
            key={index}
            className="text-sm flex items-center gap-2 text-gray-700"
          >
            <input
              type="checkbox"
              value={facility}
              {...register("facilities", {
                validate: (facilities: string[]) => {
                  // Return true or error message
                  return facilities.length > 0 || "At least one facility is required.";
                },
              })}
              className="w-4 h-4"
            />
            {facility}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesDetails;
