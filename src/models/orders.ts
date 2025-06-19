import { Schema, model, Types } from "mongoose";

export enum orderStatus {
    Menunggu = "menunggu",
    Diterima = "diterima",
    Selesai = "selesai",
    Dibatalkan = "dibatalkan"
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
    total: number
}

const orderSchema = new Schema ({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    tour_id: {type: String, required: true}, // TODO: Use ref: "Tour", need to create tour model first
    payment_method: {
        type: String,
        enum: Object.values(paymentMethod),
        required: true
    },
    order_status: {
        type: String,
        enum: Object.values(orderStatus),
        required: true,
        default: orderStatus.Menunggu
    },
    total: {type: String, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "update_at"}
});

const Order = model<IOrder>("Orders", orderSchema);

export default Order;