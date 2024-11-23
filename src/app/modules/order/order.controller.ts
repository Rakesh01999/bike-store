import { Request, Response } from 'express';
import { Order } from './order.model';
import { Bike } from '../bike/bike.model';
import mongoose from 'mongoose';

// Create an order and update inventory
const createOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession(); // Start a session for atomic operations
    session.startTransaction();

    try {
        const { email, product, quantity } = req.body;

        // Validate input
        if (!email || !product || !quantity) {
            return res.status(400).json({
                message: 'Email, product, and quantity are required',
                status: false,
            });
        }

        // Check if the product exists
        const bike = await Bike.findById(product).session(session);
        if (!bike || bike.isDeleted) {
            return res.status(404).json({
                message: 'Product not found or unavailable',
                status: false,
            });
        }

        // Check inventory stock
        if (bike.quantity < quantity) {
            return res.status(400).json({
                message: 'Insufficient stock to fulfill the order',
                status: false,
            });
        }

        // Calculate total price
        const totalPrice = bike.price * quantity;

        // Reduce the bike's quantity and update `inStock` status
        bike.quantity -= quantity;
        if (bike.quantity === 0) {
            bike.inStock = false;
        }
        await bike.save({ session }); // Save the updated bike in the same session

        // Create the order
        const newOrder = await Order.create([{ email, product, quantity, totalPrice }], { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Construct response with `_id` at the top
        const responseData = {
            _id: newOrder[0]._id,
            email: newOrder[0].email,
            product: newOrder[0].product,
            quantity: newOrder[0].quantity,
            totalPrice: newOrder[0].totalPrice,
            createdAt: newOrder[0].createdAt,
            updatedAt: newOrder[0].updatedAt,
        };

        // Send the response
        return res.status(201).json({
            message: 'Order created successfully',
            status: true,
            data: responseData,
        });
    } catch (error) {
        await session.abortTransaction(); // Rollback transaction if an error occurs
        session.endSession();

        console.error('Error creating order:', error);
        return res.status(500).json({
            message: 'An error occurred while creating the order',
            status: false,
        });
    }
};

// Calculate total revenue from all orders
const calculateRevenue = async (req: Request, res: Response) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        ]);

        const revenue = totalRevenue[0]?.totalRevenue || 0;

        return res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: {
                totalRevenue: revenue,
            },
        });
    } catch (error: any) {
        console.error('Error calculating revenue:', error.message);
        return res.status(500).json({
            message: error.message || 'An unexpected error occurred',
            status: false,
        });
    }
};

// Export the OrderController
export const OrderController = {
    createOrder,
    calculateRevenue,
};
