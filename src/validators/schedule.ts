import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ID, check again",
});

export const createScheduleSchema = z.object({
  order_id: objectIdSchema,
  driver_id: objectIdSchema,
  times: z.string().min(1, "Times is required"),
  available: z.boolean().optional()
});

export const updateScheduleSchema = z.object({
  times: z.string().min(1, "Times is required").optional(),
  available: z.boolean().optional(),
  driver_id: objectIdSchema.optional(),
  order_id: objectIdSchema.optional()
});

export const needScheduleIDSchema = z.object({
  schedule_id: objectIdSchema
});
