import React from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./api-clients";
import ManageHotelForm from "../forms/manageHotelForm/ManageHotelForm";
import { toast } from "react-toastify";

const Edithotel = () => {
    const { hotelId } = useParams();

    const { data: hotel, error, isError, isLoading: isFetching } = useQuery(
        ["fetchMyHotelById", hotelId],
        () => apiClient.fetchMyHotelsById(hotelId || ""),
        { enabled: !!hotelId }
    );

    const { mutate, isLoading: isSaving } = useMutation(apiClient.updateMyHotelIdByid, {
        onSuccess: () => toast("Hotel updated successfully!") ,
        onError: (err: any) => toast(`Error updating hotel: ${err.message}`)
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    if (isError) {
        return <div>Error fetching hotel: {error?.message}</div>;
    }

    if (isFetching) {
        return <div>Loading hotel data...</div>;
    }

    return (
        <ManageHotelForm 
            hotel={hotel} 
            onSave={handleSave} 
            isLoading={isSaving} 
        />
    );
};

export default Edithotel;
