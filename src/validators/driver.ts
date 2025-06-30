import mongoose from "mongoose";
import { z } from "zod";
import { daysArray, timesArray } from "../models/driverAvailability";

export const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addAvailabilitiesSchema = z.object({
    driver_id: objectIdSchema,
    days: z
    .array(z.enum([ // enum dari daysArray
      daysArray.Monday,
      daysArray.Tuesday,
      daysArray.Wednesday,
      daysArray.Thursday,
      daysArray.Friday,
      daysArray.Saturday,
      daysArray.Sunday,
    ]))
    .min(1, { message: "At least one day is required" }),

  times: z
    .array(z.enum([ // enum dari timesArray
      timesArray.Morning,
      timesArray.Afternoon,
      timesArray.Dawn
    ]))
    .min(1, { message: "At least one time slot is required" }),
})

export const searchAvailabilitiesSchema = z.object({
    days: z
        .array(z.enum([
            daysArray.Monday,
            daysArray.Tuesday,
            daysArray.Wednesday,
            daysArray.Thursday,
            daysArray.Friday,
            daysArray.Saturday,
            daysArray.Sunday,
        ]))
        .optional(),
    times: z
        .array(z.enum([
            timesArray.Morning,
            timesArray.Afternoon,
            timesArray.Dawn
        ]))
        .optional(),
});