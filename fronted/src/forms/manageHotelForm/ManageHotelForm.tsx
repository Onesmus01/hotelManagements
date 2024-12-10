import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSections from "./DetailsSections";
import TypeSection from "./TypeSection";
import GuestSection from "./GuestSection";
import FacilitiesDetails from "./FacilitiesDetails";
import ImageSection from "../ImageSection";

// Define the structure for form data
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
};

type Props = {
  onSave: (hotelFormData: FormData) => Promise<void>; // Ensure onSave supports async operations
  isLoading: boolean;
};

const ManageHotelForm: React.FC<Props> = ({ onSave, isLoading }: Props) => {
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
    },
  });

  const { handleSubmit, formState: { errors }, reset } = formMethods;

  const onSubmit = async (formDataJson: HotelFormData) => {
    const formData = new FormData();

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