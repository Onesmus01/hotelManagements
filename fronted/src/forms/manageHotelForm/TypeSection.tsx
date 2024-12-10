import React from "react";
import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotelConfig";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  const typeWatch = watch("type");

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-3">Type</h2>
      <div className="grid grid-cols-5 gap-2">
        {hotelTypes.map((type, index) => (
          <label
            key={index}
            className={`cursor-pointer text-sm rounded-full px-4 py-2 flex items-center justify-center transition-colors ${
              typeWatch === type
                ? "bg-blue-300 text-white border-2 border-blue-500"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            <input
              type="radio"
              value={type}
              {...register("type", {
                required: "This field is required",
              })}
              className="hidden"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;
