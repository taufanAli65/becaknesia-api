import { Schema, model, Types } from "mongoose";

export enum driverStatus {
    Active = "active",
    Suspend = "suspend"
}

export interface IDriver extends Document{
    user_id: Types.ObjectId;
    status: driverStatus,
    created_at: Date,
    update_at: Date,
}


const driverSchema = new Schema({
    user_id: {type: Types.ObjectId, ref: "Users", required: true},
    status: {
        type: String,
        enum: Object.values(driverStatus),
        required: true,
        default: driverStatus.Active
    }
}, {
    timestamps: {createdAt: "created_at", updatedAt: "update_at"}
})

const Driver = model<IDriver>("Drivers", driverSchema);

export default Driver;