import React, { useState } from 'react';
import { useSearchContext } from '../context/SearchContext';
import { useQuery } from 'react-query';
import * as apiClient from './api-clients';
import SearchResultCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import StarRatingFilter from '../components/StarRatingFilter';
import HotelTypeFilter from '../components/HotelTypeFilter';
import FacilitiesFilter from '../components/FacilitiesFilter';
import PriceFilter from '../components/PriceFilter';

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState('');

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption, // Can be an empty string, but it's still included
    };

    const { data: hotelData, isLoading, error } = useQuery(
        ['searchHotels', searchParams],
        () => apiClient.searchHotels(searchParams),
        { keepPreviousData: true }
    );

    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;
        setSelectedStars((prevStars) =>
            event.target.checked
                ? [...prevStars, starRating]
                : prevStars.filter((star) => star !== starRating)
        );
        setPage(1); // Reset to the first page
    };

    const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = event.target.value;
        setSelectedHotelTypes((prevHotelTypes) =>
            event.target.checked
                ? [...prevHotelTypes, hotelType]
                : prevHotelTypes.filter((type) => type !== hotelType)
        );
        setPage(1); // Reset to the first page
    };

    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const facility = event.target.value;
        setSelectedFacilities((prevFacilities) =>
            event.target.checked
                ? [...prevFacilities, facility]
                : prevFacilities.filter((prevFacility) => prevFacility !== facility)
        );
        setPage(1);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value); // Update the sortOption state
        setPage(1); // Reset to the first page
    };

    if (isLoading) {
        return (
            <div className="text-center text-gray-500">
                <div className="spinner-border animate-spin w-8 h-8 border-4 rounded-full text-blue-500"></div>
                <p>Loading hotels...</p>
            </div>
        );
    }

    if (error instanceof Error) {
        return (
            <div className="text-center text-red-500">
                Error: {error.message} <br />
                Please try again later.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            {/* Sidebar Filters */}
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5 ">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">Filter by:</h3>
                    <StarRatingFilter
                        selectedStars={selectedStars}
                        onChange={handleStarsChange}
                    />
                    <HotelTypeFilter
                        selectedHotelTypes={selectedHotelTypes}
                        onChange={handleHotelTypeChange}
                    />
                    <FacilitiesFilter
                        selectedFacilities={selectedFacilities}
                        onChange={handleFacilityChange}
                    />
                    <PriceFilter
                        selectedPrice={selectedPrice}
                        onChange={(value?: number) => setSelectedPrice(value)}
                    />
                </div>
            </div>

            {/* Search Results */}
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ''}
                    </span>
                    <div className="text-sm text-gray-500">
                        <label htmlFor="sort" className="mr-2">
                            Sort by:
                        </label>
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="border border-slate-300 rounded-md p-1"
                        >
                            <option value="">Sort By</option>
                            <option value="starRating">Star Rating</option>
                            <option value="pricePerNightAsc">Price per night (low to high)</option>
                            <option value="pricePerNightDesc">Price per night (high to low)</option>
                        </select>
                    </div>
                </div>
                {hotelData?.data.map((hotel) => (
                    <div key={hotel._id} className="hover:shadow-lg transition-shadow duration-300">
                        <SearchResultCard hotel={hotel} />
                    </div>
                ))}
                <div className="mt-5">
                    <Pagination
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Search;
