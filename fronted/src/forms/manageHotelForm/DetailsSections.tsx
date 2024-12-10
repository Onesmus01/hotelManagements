import React from 'react';
import { useFormContext } from 'react-hook-form';
import { HotelFormData } from './ManageHotelForm';

const DetailsSections = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">Hotel Details</h2>

      <label className="text-gray-700 text-sm font-bold">
        Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register('name', { required: 'This field is required' })}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </label>

      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register('city', { required: 'This field is required' })}
          />
          {errors.city && <span className="text-red-500">{errors.city.message}</span>}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register('country', { required: 'This field is required' })}
          />
          {errors.country && <span className="text-red-500">{errors.country.message}</span>}
        </label>
      </div>

      <label className="text-gray-700 text-sm font-bold">
        Description
        <textarea
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register('description', { required: 'This field is required' })}
        />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      </label>

      <label className="text-gray-700 text-sm font-bold">
        Price per Night
        <input
          type="number"
          min={1}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register('pricePerNight', {
            required: 'This field is required',
            valueAsNumber: true,
            validate: (value) => value > 0 || 'Price must be greater than 0',
          })}
        />
        {errors.pricePerNight && <span className="text-red-500">{errors.pricePerNight.message}</span>}
      </label>

      <label className="text-gray-700 text-sm font-bold">
        Star Rating
        <select
          {...register('starRating', { required: 'This field is required' })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="">Select a Rating</option>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        {errors.starRating && <span className="text-red-500">{errors.starRating.message}</span>}
      </label>
    </div>
  );
};

export default DetailsSections;
