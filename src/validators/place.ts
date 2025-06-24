import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const needPlaceIDSchema = z.object({
    place_id: objectIdSchema
});

export const createPlaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  coordinates: z.string().min(1, "Coordinates are required"),
  description: z.string().min(1, "Description is required"),
  photo_url: z.string().url("Photo URL must be a valid URL")
});

export const updatePlaceSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  coordinates: z.string().min(1, "Coordinates cannot be empty").optional(),
  description: z.string().min(1, "Description cannot be empty").optional(),
  photo_url: z.string().url("Photo URL must be a valid URL").optional()
});
