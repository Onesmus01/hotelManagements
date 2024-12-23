import React from 'react';
import { useForm } from 'react-hook-form';
import { paymentIntentResponse, UserType } from '../../config/hotelConfig';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { useSearchContext } from '../../context/SearchContext';
import { useParams } from 'react-router-dom';
import * as apiClient from '../../pages/api-clients'
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

type Props = {
  currentUser: UserType;
  paymentIntent:paymentIntentResponse
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number,

};

const BookingForm = ({ currentUser ,paymentIntent }: Props) => {
  const elements = useElements()
  const stripe = useStripe()
  const search = useSearchContext()
  const {hotelId} = useParams()
  const {mutate: bookRoom,isLoading} = useMutation(apiClient.createRoomBooking,{
    onSuccess: ()=> {
      toast.success('Booking saved')

    },
    onError: ()=> {
      toast.error("error saving Booking")

    }
  })
  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount:search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async(data: BookingFormData) => {
  if(!stripe || !elements) {
    return
  }
    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret,{
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      }
    })
    if(result.paymentIntent?.status === "succeeded") {
      //book the room
      bookRoom({...FormData,paymentIntentId: result.paymentIntent.id})

    }
  };

  return (
    <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5" onSubmit={handleSubmit(onSubmit)}>
      <span className="text-3xl font-bold">Confirm your details</span>
      <div className="grid grid-cols-1 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register('firstName')}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register('lastName')}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="email"
            readOnly
            disabled
            {...register('email')}
          />
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
      >
        Confirm Booking
      </button>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your price summery</h2>

        <div className="bg-blue-200 p-4 rounded-md">
        <div className="font-semibold text-lg">
          Total Cost: ${paymentIntent.totalCost.toFixed(2)}
        </div>
        <div className="text-xs">ncludes taxes aand charges</div>
      </div>
        
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">payment Details</h3>
        <CardElement id='payment-element'
        className='border rounded-md p-2 text-sm'
        />
      </div>

      <div className="flex justify-end">
        <button 
        disabled={isLoading}
        type='submit' className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500">
          {isLoading ? "saving.." : "Confirm Booking"}
          Confirm Booking
        </button>
      </div>
      
    </form>
  );
};

export default BookingForm;
