import DriverAvailability from "../models/driverAvailability";

export default async function findDriver(day: string, time: string) {
    const availableDrivers = await DriverAvailability.find({days: day, times: time});
    return availableDrivers;
}