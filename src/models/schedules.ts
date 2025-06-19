import { Schema, model, Types } from "mongoose";

export interface ISchedule extends Document {
    tour_id: Types.ObjectId,
    times: string,
    available: boolean,
    user_id: Types.ObjectId
}

const scheduleSchema = new Schema({
    tour_id: { type: Types.ObjectId, ref: "Tours", required: true},
    times: {type: String, required: true},
    available: {
        type: Boolean,
        default: false,
        required: true
    },
    user_id: {type: Types.ObjectId, ref: "Users", required: true}
})

const Schedule = model<ISchedule>("Schedules", scheduleSchema);

export default Schedule;