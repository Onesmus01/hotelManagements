import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useSearchContext } from '../../../context/SearchContext';
import { useAppContext } from '../../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    hotelId: string;
    pricePerNight: number;
};

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
    const search = useSearchContext();
    const { isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        watch,
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<GuestInfoFormData>({
        defaultValues: {
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            childCount: search.childCount,
        },
    });

    const checkIn = watch('checkIn');
    const checkOut = watch('checkOut');

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const onSignInClick = (data: GuestInfoFormData) => {
        search.saveSearchValues(
            '',
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.childCount
        );
        navigate('/signin', { state: { from: location } });
    };

    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues(
            '',
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.childCount
        );
        navigate(`/hotel/${hotelId}/booking`, { state: { from: location } });
    };

    return (
        <div className="flex flex-col p-6 bg-blue-50 rounded-lg shadow-lg gap-6">
            <h3 className="text-lg font-semibold text-blue-600">
                ${pricePerNight} per night
            </h3>
            <form
                onSubmit={
                    isLoggedIn
                        ? handleSubmit(onSubmit)
                        : handleSubmit(onSignInClick)
                }
            >
                <div className="grid grid-cols-1 gap-6 items-center">
                    <div>
                        <DatePicker
                            selected={checkIn}
                            onChange={(date) =>
                                setValue('checkIn', date as Date)
                            }
                            required
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            wrapperClassName="w-full"
                        />
                    </div>
                    <DatePicker
                        selected={checkOut}
                        onChange={(date) =>
                            setValue('checkOut', date as Date)
                        }
                        required
                        selectsEnd
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={minDate}
                        maxDate={maxDate}
                        placeholderText="Check-out Date"
                        className="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        wrapperClassName="w-full"
                    />
                </div>
                <div className="flex bg-white px-4 py-3 gap-6 mt-6 rounded-lg shadow-md">
                    <label className="flex flex-col items-center w-1/2">
                        Adults:
                        <input
                            className="w-full p-3 mt-2 text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            min={1}
                            max={20}
                            {...register('adultCount', {
                                required: 'This field is required',
                                min: {
                                    value: 1,
                                    message: 'There must be at least one adult',
                                },
                                valueAsNumber: true,
                            })}
                        />
                    </label>
                    <label className="flex flex-col items-center w-1/2">
                        Children:
                        <input
                            className="w-full p-3 mt-2 text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            min={0}
                            max={20}
                            {...register('childCount', {
                                valueAsNumber: true,
                            })}
                        />
                    </label>
                    {errors.adultCount && (
                        <span className="text-sm text-red-600 mt-2">
                            {errors.adultCount?.message}
                        </span>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold"
                    >
                        {isLoggedIn ? 'Book Now' : 'Sign in to Book'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GuestInfoForm;
