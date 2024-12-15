import React, { useState } from 'react'
import { useSearchContext } from '../context/SearchContext'
import { useQuery } from 'react-query'
import * as apiClient from './api-clients'
import SearchResultCard from '../components/SearchResultCard'
import Pagination from '../components/Pagination'

const Search = () => {
    const search = useSearchContext()
    const [page, setPage] = useState<number>(1)

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString()
    }

    const { data: hotelData, isLoading, error } = useQuery(
        ["searchHotels", searchParams],
        () => apiClient.searchHotels(searchParams)
    )

    if (isLoading) return <div>Loading...</div>
    if (error instanceof Error) return <div>Error: {error.message}</div>

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className='text-lg font-semibold border-b border-slate-300 pb-5'>filter by:</h3>
                    {/* Add your filters here */}
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className='text-xl font-bold'>
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    {/* \ToDo sort options */}
                </div>
                
                {hotelData?.data.map((hotel) => (
                    <SearchResultCard key={hotel._id} hotel={hotel} />
                ))}
                
                <div className="">
                    <Pagination 
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Search
