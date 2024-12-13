import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSections from "./DetailsSections";
import TypeSection from "./TypeSection";
import GuestSection from "./GuestSection";
import FacilitiesDetails from "./FacilitiesDetails";
import ImageSection from "../ImageSection";
import MyHotels from "../../pages/MyHotels";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  adultCount: number;
  childCount: number;
  imageUrls?: string[]; // Optional field for image URLs
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => Promise<void>;
  isLoading: boolean;
};

const ManageHotelForm: React.FC<Props> = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>({
    defaultValues: {
      name: "",
      city: "",
      country: "",
      description: "",
      type: "",
      pricePerNight: 0,
      starRating: 0,
      facilities: [],
      adultCount: 0,
      childCount: 0,
      imageUrls: [], // Default to empty array if not provided
    },
  });

  const { handleSubmit, formState: { errors }, reset } = formMethods;

  useEffect(() => {
    if (hotel) {
      reset(hotel);
    }
  }, [hotel, reset]);

  const onSubmit = async (formDataJson: HotelFormData) => {
    const formData = new FormData();

    // Append hotel ID if editing an existing hotel
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }

    // Append all fields to FormData
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    // Append image URLs if provided
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url); // Corrected variable name to formData
      });
    }

    // Append facilities
    formDataJson.facilities.forEach((facility, index) =>
      formData.append(`facilities[${index}]`, facility)
    );

    // Append image files
    Array.from(formDataJson.imageFiles).forEach((imageFile) =>
      formData.append("imageFiles", imageFile)
    );

    try {
      await onSave(formData); // Await the save operation
      reset(); // Reset the form after successful save
    } catch (error) {
      console.error("Error saving hotel data:", error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-10"
      >
        <DetailsSections />
        <TypeSection />
        <FacilitiesDetails />
        <GuestSection />
        <ImageSection />

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 mt-4 text-white text-xl font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loader mr-2"></span> Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500">
            Please fill all required fields correctly.
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
