import express from 'express'
// import {HotelSearchResponse} from '../shared/types'
import {param,validationResult} from 'express-validator'
import mongoose from 'mongoose'
import Hotel from '../models/hotelModel.js'

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


searchRouter.get('/:id',[param("id").notEmpty().withMessage("HotelId is required")], async (req, res) => {
    const errors = validationResult(req)
    const id = req.params.id.toString()


    // Validate that the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ errors: 'Invalid Hotel ID' });
    }
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }


    try {
        const hotel = await Hotel.findById(id);  // Use the id to search for the hotel
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching Hotels' });
    }
});






export default searchRouter

