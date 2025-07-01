import DriverAvailability, { daysArray, timesArray } from "../models/driverAvailability";
import { Types } from "mongoose";
import { AppError } from "../utils/appError";
import Driver from "../models/drivers";
import findDriver from "../helpers/findAvailableDriver";

interface AddAvailabilityInput {
    driver_id: string;
    days: daysArray[];
    times: timesArray[];
}

async function addAvailabilitiesService(data: AddAvailabilityInput) {
    const { driver_id, days, times } = data;
    if (!Types.ObjectId.isValid(driver_id)) throw AppError("Invalid driver ID", 400);
    const driver = await Driver.findOne({user_id: driver_id});
    if (!driver) throw AppError("There is no driver with following ID", 404);

    const newAvailability = new DriverAvailability({
        driver_id,
        days,
        times
    });
    await newAvailability.save();
    return newAvailability;
};

async function getDriverAvailabilitiesService(driver_id: string) {
    const driverAvailability = await DriverAvailability.findOne({driver_id})

    if (!driverAvailability) {
      throw AppError("Driver not found", 404);
    }

    return driverAvailability;
}

interface SearchAvailabilityInput {
    days?: daysArray[];
    times?: timesArray[];
}

async function searchDriverAvailabilitiesService(data: SearchAvailabilityInput) {
    const { days, times } = data;
    // If both days and times are provided and are single values, use findDriver
    if (
        Array.isArray(days) && days.length === 1 &&
        Array.isArray(times) && times.length === 1
    ) {
        return await findDriver(days[0], times[0]);
    }
    // fallback to original query for multiple days/times
    const query: any = {};
    if (days && days.length > 0) {
        query.days = { $in: days };
    }
    if (times && times.length > 0) {
        query.times = { $in: times };
    }
    const availabilities = await DriverAvailability.find(query);
    return availabilities;
}


export {addAvailabilitiesService, getDriverAvailabilitiesService, searchDriverAvailabilitiesService}