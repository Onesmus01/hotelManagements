import React from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { HotelFormData } from './manageHotelForm/ManageHotelForm';

const ImageSection: React.FC = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls") || [];

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, imageUrl: string) => {
    event.preventDefault();
    setValue("imageUrls", existingImageUrls.filter((url) => url !== imageUrl));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls.length > 0 && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Image ${index + 1}`} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 text-white">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal p-2 border rounded"
          {...register("imageFiles", {
            validate: (imageFiles: FileList | undefined) => {
              const totalLength = (imageFiles?.length || 0) + existingImageUrls.length;

              if (totalLength === 0) {
                return "At least one image should be added.";
              }

              if (totalLength > 6) {
                return "Total number of images cannot exceed 6.";
              }

              const invalidFile = Array.from(imageFiles || []).find(
                (file) => file.size > 5 * 1024 * 1024
              );

              if (invalidFile) {
                return `File "${invalidFile.name}" exceeds 5 MB size limit.`;
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {(errors.imageFiles as FieldError).message || 'Invalid image selection'}
        </span>
      )}
    </div>
  );
};

export default ImageSection;
