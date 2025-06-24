import mongoose from "mongoose";
import { z } from "zod"

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addReviewSchema = z.object({
    driver_id: objectIdSchema,
    stars: z.number().min(1, "Input stars range start from 1-5").max(5, "Input stars range start from 1-5"),
    comment: z.string().optional()
})

export const updateReviewSchema = z.object({
  stars: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional()
});

export const needReviewIDSchema = z.object({
  review_id: objectIdSchema
});