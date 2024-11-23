import { Request, Response } from 'express';
import { BikeServices } from './bike.service';
import bikeValidationSchema from './bike.validation';

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

const getAllBikes = async (req: Request, res: Response) => {
    try {
        const result = await BikeServices.getAllBikesFromDB();

        return res.status(200).json({
            success: true,
            message: 'Bikes retrieved successfully',
            data: result,
        });
    } 
    // catch (err: any) {
    catch (err) {
        // return res.status(500).json({
        //     success: false,
        //     message: err.message || 'Something went wrong',
        //     error: err,
        // });
        console.log(err);
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

export const BikeControllers = {
    createBike,
    getAllBikes,
    getSingleBike,
    deleteBike,
    getBikeByIdOrModelNumber,
    getBikeById
};

