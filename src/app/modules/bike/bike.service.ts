import mongoose from "mongoose";
import { TBike } from "./bike.interface"; // Assuming you have a `bike.interface` file
import { Bike, Order } from "./bike.model";

const createBikeInDB = async (bikeData: TBike) => {
    // Check if the bike already exists by a unique identifier (e.g., modelNumber)
    if (await Bike.isBikeExists(bikeData.modelNumber)) {
        throw new Error("Bike already exists");
    }

    // Save the bike to the database
    const result = await Bike.create(bikeData);
    return result;
};

// const getAllBikesFromDB = async () => {
//     // Retrieve all bikes from the database
//     const result = await Bike.find();
//     return result;
// };


//  ---------- Mod
export const getAllBikesFromDB = async (filter: any) => {
    try {
        // Ensure the filter is correctly passed and applied
        const bikes = await Bike.find(filter);
        return bikes;
    } catch (error) {
        throw new Error("Error fetching bikes from database");
    }
};

const getSingleBikeFromDB = async (id: string) => {
    // Retrieve a single bike based on its unique identifier
    const result = await Bike.aggregate([
        { $match: { modelNumber: id } },
        // { $match: { _id: id } },
    ]);
    return result;
};

// ------------
const getBikeByIdOrModelNumber = async (identifier: string) => {
    // Try to fetch by _id or modelNumber
    const bike = await Bike.findOne({
        $or: [{ _id: identifier }, { modelNumber: identifier }],
    });

    if (!bike) {
        throw new Error('Bike not found');
    }

    return bike;
};

const getBikeById = async (productId: string) => {
    try {
        // Use Mongoose's `findById` method to fetch the bike
        const bike = await Bike.findById(productId);

        // If no bike is found, return null
        return bike;
    } catch (error) {
        throw new Error("Invalid ID format or database error");
    }
};

// ------------

const deleteBikeFromDB = async (_id: string) => {
    // Soft-delete a bike by marking it as deleted
    // const result = await Bike.updateOne({ modelNumber: id }, { isDeleted: true });
    const result = await Bike.updateOne({ _id }, { isDeleted: true });
    return result;
};

const updateBikeInDB = async (productId: string, updateData: Partial<TBike>) => {
    try {
        // Validate that the productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid Product ID');
        }

        // Find the bike by ID and update it with the provided data
        const updatedBike = await Bike.findByIdAndUpdate(
            productId,
            { ...updateData, updatedAt: new Date() }, // Merge new data and update timestamp
            { new: true, runValidators: true } // Options to return the updated document and run validators
        );

        if (!updatedBike) {
            throw new Error('Bike not found or could not be updated');
        }

        return updatedBike;
    } catch (error) {
        throw new Error(error.message || 'An error occurred while updating the bike');
    }
};


// ------- Order 

// const createOrderInDB = async (orderData: {
//     email: string;
//     product: string;
//     quantity: number;
//     totalPrice: number;
// }) => {
//     const session = await mongoose.startSession(); // Start a transaction session
//     session.startTransaction();

//     try {
//         const { email, product, quantity, totalPrice } = orderData;

//         // Find the bike by ID
//         const bike = await Bike.findById(product).session(session);
//         if (!bike || bike.isDeleted) {
//             throw new Error('Bike not found or unavailable for ordering');
//         }

//         // Check for sufficient stock
//         if (bike.quantity < quantity) {
//             throw new Error('Insufficient stock to fulfill the order');
//         }

//         // Reduce inventory quantity and update inStock status if necessary
//         bike.quantity -= quantity;
//         if (bike.quantity === 0) {
//             bike.inStock = false;
//         }
//         await bike.save({ session });

//         // Create the order
//         const newOrder = await Order.create([{ email, product, quantity, totalPrice }], { session });

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         return newOrder[0]; // Return the created order
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         throw new Error(error.message || 'Order creation failed');
//     }
// };




export const BikeServices = {
    createBikeInDB,
    getAllBikesFromDB,
    getSingleBikeFromDB,
    deleteBikeFromDB,
    getBikeByIdOrModelNumber,
    getBikeById,
    updateBikeInDB,
    // createOrderInDB
};
