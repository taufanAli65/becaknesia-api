import { Schema, model, Types } from "mongoose";

export enum orderStatus {
    Waiting = "waiting",
    Accepted = "Accepted",
    Done = "done",
    Canceled = "Canceled"
}

export enum paymentStatus {
    Failed = "failed",
    Success = "success",
    Pending = "pending"
}

export enum paymentMethod {
    Cash = "cash",
    Qris = "qris",
}

export interface IOrder extends Document {
    user_id: Types.ObjectId,
    created_at: Date,
    update_at: Date,
    tour_id: Types.ObjectId,
    order_status: orderStatus,
    total: number,
    payment_status: paymentStatus,
    pickup_location: string,
    pickup_time: string
}

const orderSchema = new Schema ({
    user_id: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    tour_id: {type: Schema.Types.ObjectId, ref: "Tours", required: true},
    payment_method: {
        type: String,
        enum: Object.values(paymentMethod),
        required: true
    },
    order_status: {
        type: String,
        enum: Object.values(orderStatus),
        required: true,
        default: orderStatus.Waiting
    },
    total: {type: String, required: true},
    payment_status: {
        type: String,
        enum: Object.values(paymentStatus),
        required: true,
        default: paymentStatus.Pending
    },
    pickup_location: {type: String, required: true},
    pickup_time: {type: String, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "update_at"}
});

const Order = model<IOrder>("Orders", orderSchema);

export default Order;