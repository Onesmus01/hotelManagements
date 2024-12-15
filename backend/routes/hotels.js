import express from 'express'
import Hotel from '../models/hotelModel.js'
// import {HotelSearchResponse} from '../shared/types'

const searchRouter = express.Router()

searchRouter.get("/search", async (req, res) => {
    try {
        // Construct the search query from request parameters
        const query = constructSearchQuery(req.query);

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page || "1", 10);

        // Validate page number
        if (pageNumber < 1) {
            return res.status(400).json({ msg: "Invalid page number, should start at 1" });
        }

        const skip = (pageNumber - 1) * pageSize;

        // Fetch hotels and total document count concurrently
        const [hotels, total] = await Promise.all([
            Hotel.find(query).skip(skip).limit(pageSize),
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

