import { Schema, model, Types } from "mongoose";

export enum daysArray {
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday",
    Saturday = "saturday",
    Sunday = "sunday"
}

export enum timesArray {
    Morning = "08.00 - 10.00",
    Afternoon = "14.00 - 16.00",
    Dawn = "17.00 - 19.00"
}

export interface IDriverAvailability extends Document{
    driver_id: Types.ObjectId,
    days: Array<daysArray>,
    times: Array<timesArray>
    created_at: Date,
    updated_at: Date
}

const driverAvailabilitySchema = new Schema({
    driver_id: {type: Types.ObjectId, ref: "Drivers", required: true},
    days: {
        type: [String],
        enum: Object.values(daysArray),
        required: true,
        validate: [(arr: string | any[]) => arr.length > 0, 'At least one day is required']
    },
    times: {
        type: [String],
        enum: Object.values(timesArray),
        required: true,
        validate: [(arr: string | any[]) => arr.length > 0, 'At least one time is required']
    }
}, {
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
})

const DriverAvailability = model<IDriverAvailability>("DriverAvailability", driverAvailabilitySchema);

export default DriverAvailability;