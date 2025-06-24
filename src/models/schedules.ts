import { Schema, model, Types } from "mongoose";

export interface ISchedule extends Document {
    tour_id: Types.ObjectId,
    times: string,
    available: boolean,
    driver_id: Types.ObjectId,
    created_at: Date,
    updated_at: Date
}

const scheduleSchema = new Schema({
    tour_id: { type: Types.ObjectId, ref: "Tours", required: true},
    times: {type: String, required: true},
    available: {
        type: Boolean,
        default: false,
        required: true
    },
    driver_id: {type: Types.ObjectId, ref: "Drivers", required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
});

const Schedule = model<ISchedule>("Schedules", scheduleSchema);

export default Schedule;