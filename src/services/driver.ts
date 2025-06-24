import DriverAvailability, { daysArray, timesArray } from "../models/driverAvailability";
import { Types } from "mongoose";
import { AppError } from "../utils/appError";
import Driver from "../models/drivers";

interface AddAvailabilityInput {
    driver_id: string; // as string from request
    days: daysArray[];
    times: timesArray[];
}

async function addAvailabilitiesService(data: AddAvailabilityInput) {
    const { driver_id, days, times } = data;
    if (!Types.ObjectId.isValid(driver_id)) throw AppError("Invalid driver ID", 400);
    const driver = await Driver.findById({driver_id});
    if (!driver) throw AppError("There is no driver with following ID", 404);

    const newAvailability = new DriverAvailability({
        driver_id,
        days,
        times
    });
    await newAvailability.save();
    return newAvailability;
};


export {addAvailabilitiesService}