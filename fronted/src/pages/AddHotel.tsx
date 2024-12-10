import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ManageHotelForm from '../forms/manageHotelForm/ManageHotelForm.js';
import { useMutation } from 'react-query';
import * as apiClient from './api-clients'

const AddHotel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {mutate} = useMutation(apiClient.AddMyHotel,{
    onSuccess: ()=>{
      toast.success("Hotel saved")
   },
   onError: ()=>{
    toast.error("Error saving Hotel")
   }
  })

  const handleSave = async (hotelFormData: FormData) => {
     mutate(hotelFormData)
    setIsLoading(true);
         
  };

  return (
    <div className="container mx-auto p-5">
      <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
};

export default AddHotel;





