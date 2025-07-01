import mongoose from "mongoose";
import { z } from "zod";
import { daysArray, timesArray } from "../models/driverAvailability";

export const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ID, check again",
});

export const addAvailabilitiesSchema = z.object({
    driver_id: objectIdSchema,
    days: z.enum([
      daysArray.Monday,
      daysArray.Tuesday,
      daysArray.Wednesday,
      daysArray.Thursday,
      daysArray.Friday,
      daysArray.Saturday,
      daysArray.Sunday,
    ]),
    times: z.enum([
      timesArray.Morning,
      timesArray.Afternoon,
      timesArray.Dawn
    ]),
})

export const searchAvailabilitiesSchema = z.object({
    days: z.enum([
        daysArray.Monday,
        daysArray.Tuesday,
        daysArray.Wednesday,
        daysArray.Thursday,
        daysArray.Friday,
        daysArray.Saturday,
        daysArray.Sunday,
    ]).optional(),
    times: z.enum([
        timesArray.Morning,
        timesArray.Afternoon,
        timesArray.Dawn
    ]).optional(),
});