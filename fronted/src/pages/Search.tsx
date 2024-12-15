import React, { useState } from 'react';
import { useSearchContext } from '../context/SearchContext';
import { useQuery } from 'react-query';
import * as apiClient from './api-clients';
import SearchResultCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import StarRatingFilter from '../components/StarRatingFilter';

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);

    // Construct search parameters
    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars, // Include selected star ratings
    };

    // Fetch hotels using React Query
    const { data: hotelData, isLoading, error } = useQuery(
        ["searchHotels", searchParams],
        () => apiClient.searchHotels(searchParams)
    );

    // Handle star rating filter changes
    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;
        setSelectedStars((prevStars) =>
            event.target.checked
                ? [...prevStars, starRating] // Add star rating
                : prevStars.filter((star) => star !== starRating) // Remove star rating
        );
    };

    // Loading and error states
    if (isLoading) return <div className="text-center text-gray-500">Loading hotels...</div>;
    if (error instanceof Error) return <div className="text-center text-red-500">Error: {error.message}</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            {/* Filter Sidebar */}
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">Filter by:</h3>
                    {/* Star Rating Filter */}
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange} />
                    {/* Additional filters can be added here */}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-5">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    {/* Placeholder for sorting options */}
                    <div className="text-sm text-gray-500">Sort Options (ToDo)</div>
                </div>

                {/* Hotel Results */}
                {hotelData?.data.map((hotel) => (
                    <SearchResultCard key={hotel._id} hotel={hotel} />
                ))}

                {/* Pagination */}
                <div className="mt-5">
                    <Pagination
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Search;
