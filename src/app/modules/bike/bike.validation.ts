import { z } from "zod";

// Bike validation schema
const bikeValidationSchema = z.object({
    modelNumber: z.string().min(1, "Model Number is required"),
    brand: z.string().min(1, "Brand is required"),
    category: z.enum(["mountain", "road", "hybrid", "electric"], {
        invalid_type_error: "Invalid category",
    }),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
    color: z.string().min(1, "Color is required"),
    features: z
        .array(z.string())
        .min(1, "At least one feature is required")
        .optional(),
    description: z.string().optional(),
    isDeleted: z.boolean().default(false),
});

export default bikeValidationSchema;
