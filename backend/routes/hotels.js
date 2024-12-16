import express from 'express'
import Hotel from '../models/hotelModel.js'
// import {HotelSearchResponse} from '../shared/types'

const searchRouter = express.Router()

searchRouter.get("/search", async (req, res) => {
    try {
        const query = constructSearchQuery(req.query);

        // SORT QUERY
        let sortOptions = {};
        switch (req.query.sortOption) {  // Use 'sortOption' (singular)
            case "starRating":
                sortOptions = { starRating: -1 };  // descending
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };  // ascending
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };  // descending
                break;
            default:
                sortOptions = { starRating: -1 };  // Default sort by star rating (descending)
                break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page || "1", 10);

        if (pageNumber < 1) {
            return res.status(400).json({ msg: "Invalid page number, should start at 1" });
        }

        const skip = (pageNumber - 1) * pageSize;

        const [hotels, total] = await Promise.all([
            Hotel.find(query).skip(skip).sort(sortOptions).limit(pageSize),
            Hotel.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / pageSize);

        // Check if the requested page exceeds total pages
        if (pageNumber > totalPages) {
            return res.status(404).json({ msg: "Page not found" });
        }

        // Response structure
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: totalPages,
            },
        };
        res.json(response);

    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});


// Construct search query based on request parameters
function constructSearchQuery(queryParams) {
    let constructedQuery = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") }
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount, 10)
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount, 10)
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities]
        };
    }

    return constructedQuery;
}


export default searchRouter

