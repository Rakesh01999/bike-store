import { Request, Response } from 'express';
import { OrderServices } from './order.service';
import { Bike } from '../bike/bike.model';
import { Order } from './order.model';

// const createOrder = async (req: Request, res: Response) => {
//     try {
//         const { email, product, quantity, totalPrice } = req.body;

//         if (!email || !product || !quantity || !totalPrice) {
//             return res.status(400).json({ success: false, message: 'Missing required fields' });
//         }

//         const newOrder = await OrderServices.createOrderInDB({ email, product, quantity, totalPrice });

//         res.status(201).json({ success: true, data: newOrder });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Order creation failed', error: error.message });
//     }
// };

const createOrder = async (req: Request, res: Response) => {
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
        const bike = await Bike.findById(product);
        if (!bike) {
            return res.status(404).json({
                message: 'Product not found',
                status: false,
            });
        }

        // Calculate total price
        const totalPrice = bike.price * quantity;

        // Create the order
        const newOrder = await Order.create({
            email,
            product,
            quantity,
            totalPrice,
        });

        // Construct response with `_id` at the top
        const responseData = {
            _id: newOrder._id,
            email: newOrder.email,
            product: newOrder.product,
            quantity: newOrder.quantity,
            totalPrice: newOrder.totalPrice,
            createdAt: newOrder.createdAt,
            updatedAt: newOrder.updatedAt,
        };

        // Send the response
        return res.status(201).json({
            message: 'Order created successfully',
            status: true,
            data: responseData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while creating the order',
            status: false,
        });
    }
};

const calculateRevenue = async (req: Request, res: Response) => {
    try {
        const totalRevenue = await Order.calculateTotalRevenue();

        return res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: {
                totalRevenue,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while calculating revenue',
            status: false,
        });
    }
};

export const OrderController = {
    createOrder,
    calculateRevenue,
};

