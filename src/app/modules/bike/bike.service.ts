import { TBike } from "./bike.interface"; // Assuming you have a `bike.interface` file
import { Bike } from "./bike.model";

const createBikeInDB = async (bikeData: TBike) => {
    // Check if the bike already exists by a unique identifier (e.g., modelNumber)
    if (await Bike.isBikeExists(bikeData.modelNumber)) {
        throw new Error("Bike already exists");
    }

    // Save the bike to the database
    const result = await Bike.create(bikeData);
    return result;
};

const getAllBikesFromDB = async () => {
    // Retrieve all bikes from the database
    const result = await Bike.find();
    return result;
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

const deleteBikeFromDB = async (id: string) => {
    // Soft-delete a bike by marking it as deleted
    // const result = await Bike.updateOne({ modelNumber: id }, { isDeleted: true });
    const result = await Bike.updateOne({ id }, { isDeleted: true });
    return result;
};

export const BikeServices = {
    createBikeInDB,
    getAllBikesFromDB,
    getSingleBikeFromDB,
    deleteBikeFromDB,
    getBikeByIdOrModelNumber,
    getBikeById
};
