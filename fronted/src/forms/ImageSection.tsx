import React from 'react';
import { useFormContext, FieldError } from 'react-hook-form';

interface FormData {
  imageFiles: FileList | undefined;
}

const ImageSection: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<FormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal p-2 border rounded"
          {...register("imageFiles", {
            validate: (imageFiles: FileList | undefined) => {
              const totalLength = imageFiles?.length ?? 0;

              if (totalLength === 0) {
                return "At least one image should be added.";
              }

              if (totalLength > 6) {
                return "Total number of images cannot exceed 6.";
              }

              // Optional: Validate file size (e.g., max 5 MB per file)
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
