import { Request, Response } from 'express';
import { BikeServices } from './bike.service';
import bikeValidationSchema from './bike.validation';
import { Bike } from './bike.model';

const createBike = async (req: Request, res: Response) => {
    try {
        const { bike: bikeData } = req.body;

        // Validate the incoming data using Zod
        const validatedData = bikeValidationSchema.parse(bikeData);

        // Save the bike to the database
        const result = await BikeServices.createBikeInDB(validatedData);
        // const result = await BikeServices.createBikeInDB(bikeData);

        return res.status(200).json({
            success: true,
            message: 'Bike created successfully',
            data: result,
        });
    }
    catch (err) {
        // console.error(err);
        console.log(err);

        // Handle validation errors or unexpected errors
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: 'Error creating bike',
                error: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
            error: String(err),
        });
    }
};

// const getAllBikes = async (req: Request, res: Response) => {
//     try {
//         const result = await BikeServices.getAllBikesFromDB();

//         return res.status(200).json({
//             success: true,
//             message: 'Bikes retrieved successfully',
//             data: result,
//         });
//     } 
//     // catch (err: any) {
//     catch (err) {
//         // return res.status(500).json({
//         //     success: false,
//         //     message: err.message || 'Something went wrong',
//         //     error: err,
//         // });
//         console.log(err);
//     }
// };

//  ---------- Mod 
const getAllBikes = async (req: Request, res: Response) => {
    try {
        const { searchTerm } = req.query;

        const filter: any = { isDeleted: false }; // Always exclude deleted bikes
        if (searchTerm) {
            const regex = new RegExp(searchTerm as string, 'i');
            filter.$or = [
                { name: regex },
                { brand: regex },
                { category: regex },
            ];
        }

        console.log("Constructed Filter:", filter); // Debugging line

        const bikes = await Bike.find(filter);

        if (bikes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bikes found matching the search criteria",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Bikes fetched successfully",
            data: bikes,
        });
    } catch (error) {
        console.error("Error fetching bikes:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching bikes",
        });
    }
};


const getSingleBike = async (req: Request, res: Response) => {
    try {
        const { bikeId } = req.params;

        const result = await BikeServices.getSingleBikeFromDB(bikeId);

        return res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err,
        });
    }
};

// ------------- getBikeByIdOrModelNumber  --------

const getBikeByIdOrModelNumber = async (req: Request, res: Response) => {
    try {
        const { identifier } = req.params;

        const result = await BikeServices.getBikeByIdOrModelNumber(identifier);

        return res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: result,
        });
    } catch (err: any) {
        return res.status(404).json({
            success: false,
            message: err.message || 'Bike not found',
            error: err,
        });
    }
};


// const getBikeById = async (req: Request, res: Response) => {
//     try {
//         const { productId } = req.params;

//         const result = await BikeServices.getBikeById(productId);

//         return res.status(200).json({
//             success: true,
//             message: 'Bike retrieved successfully',
//             data: result,
//         });
//     } catch (err: any) {
//         return res.status(404).json({
//             success: false,
//             message: err.message || 'Bike not found',
//             error: err,
//         });
//     }
// };


export const getBikeById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { productId } = req.params;
        const bike = await BikeServices.getBikeById(productId);

        if (!bike) {
            return res.status(404).json({
                success: false,
                message: 'Bike not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Bike retrieved successfully',
            data: bike,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
            error: error.message,
        });
    }
};

// ------------------------------------------------

const deleteBike = async (req: Request, res: Response) => {
    try {
        const { bikeId } = req.params;

        const result = await BikeServices.deleteBikeFromDB(bikeId);

        return res.status(200).json({
            success: true,
            message: 'Bike deleted successfully',
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err,
        });
    }
};


export const updateBikeHandler = async (req: Request, res: Response) => {
    const { productId } = req.params; // Extract product ID from route params
    const updateData = req.body;     // Extract update data from request body

    try {
        // Call the service to update the bike
        const updatedBike = await BikeServices.updateBikeInDB(productId, updateData);

        // Respond with the updated bike details
        res.status(200).json({
            success: true,
            data: updatedBike,
        });
    } catch (error) {
        // Handle errors and send appropriate response
        res.status(400).json({
            success: false,
            message: error.message || 'Could not update the bike',
        });
    }
};


//  ------------- Order

// export const createOrderHandler = async (req: Request, res: Response) => {
//     const { email, product, quantity, totalPrice } = req.body;

//     try {
//         // Call the service function to create the order
//         const order = await BikeServices.createOrderInDB({ email, product, quantity, totalPrice });

//         // Respond with success
//         res.status(201).json({
//             message: 'Order created successfully',
//             status: true,
//             data: order,
//         });
//     } catch (error) {
//         // Handle errors
//         res.status(400).json({
//             message: error.message || 'Failed to create order',
//             status: false,
//         });
//     }
// };

export const BikeControllers = {
    createBike,
    getAllBikes,
    getSingleBike,
    deleteBike,
    getBikeByIdOrModelNumber,
    getBikeById,
    updateBikeHandler,
    // createOrderHandler
};

