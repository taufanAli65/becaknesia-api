import DriverAvailability, { daysArray, timesArray } from "../models/driverAvailability";
import { Types } from "mongoose";
import { AppError } from "../utils/appError";
import Driver from "../models/drivers";
import User from "../models/users";

interface AddAvailabilityInput {
    driver_id: string;
    days: daysArray;
    times: timesArray;
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
    if (!Types.ObjectId.isValid(driver_id)) throw AppError("Invalid driver ID", 400);
    const availabilities = await DriverAvailability.find({ driver_id });
    const driver_info = await User.findOne({ _id: driver_id });
    return {
        availabilities,
        driver_name: driver_info?.name
    };
}

interface SearchAvailabilityInput {
    days?: daysArray;
    times?: timesArray;
}

async function searchDriverAvailabilitiesService(data: SearchAvailabilityInput) {
    const { days, times } = data;
    const query: any = {};
    if (days) query.days = days;
    if (times) query.times = times;
    const availabilities = await DriverAvailability.find(query);
    return availabilities;
}

// Update & Delete
async function updateDriverAvailabilityService(driver_id: string, availability_id: string, days?: daysArray, times?: timesArray) {
    if (!Types.ObjectId.isValid(driver_id)) throw AppError("Invalid driver ID", 400);
    if (!Types.ObjectId.isValid(availability_id)) throw AppError("Invalid availability ID", 400);
    const availability = await DriverAvailability.findById(availability_id);
    if (!availability) throw AppError("Availability not found", 404);
    if (availability.driver_id.toString() !== driver_id) throw AppError("Unauthorized", 403);

    if (days) availability.days = days;
    if (times) availability.times = times;
    await availability.save();
    return availability;
}

async function deleteDriverAvailabilityService(driver_id: string, availability_id: string) {
    if (!Types.ObjectId.isValid(driver_id)) throw AppError("Invalid driver ID", 400);
    if (!Types.ObjectId.isValid(availability_id)) throw AppError("Invalid availability ID", 400);
    const availability = await DriverAvailability.findById(availability_id);
    if (!availability) throw AppError("Availability not found", 404);
    if (availability.driver_id.toString() !== driver_id) throw AppError("Unauthorized", 403);

    await availability.deleteOne();
    return { success: true };
}

export {
    addAvailabilitiesService,
    getDriverAvailabilitiesService,
    searchDriverAvailabilitiesService,
    updateDriverAvailabilityService,
    deleteDriverAvailabilityService
}