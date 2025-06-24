import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const createNewTourPackageSchema = z.object({
    route_name: z.string().min(8, "Route name must be at least 8 characters long"),
    description: z.string().min(15, "Description must be at leat 15 charactes long"),
    duration: z.number(),
    distances: z.number(),
    routes: z.array(z.string()),
    prices: z.number()
});

export const needTourIDSchema = z.object({
    tourID: objectIdSchema
});

export const updateTourPackageSchema = z.object({
  route_name: z.string().min(1, "Route name cannot be empty").optional(),
  description: z.string().min(1, "Description cannot be empty").optional(),
  duration: z.number().positive("Duration must be a positive number").optional(),
  distances: z.number().positive("Distance must be a positive number").optional(),
  routes: z.array(z.string()).optional(),
  prices: z.number().positive("Price must be a positive number").optional()
});