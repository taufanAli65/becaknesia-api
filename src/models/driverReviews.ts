import { Schema, model, Types } from "mongoose";

export interface IDriverReview {
    user_id: Types.ObjectId,
    driver_id: Types.ObjectId,
    order_id: Types.ObjectId,
    stars: number,
    comment: string,
    created_at: Date,
    updated_at: Date
}

const driverReviewSchema = new Schema({
    user_id: {type: Types.ObjectId, ref: "Users", required: true},
    driver_id: {type: Types.ObjectId, ref: "Drivers", required: true},
    order_id: {type: Types.ObjectId, ref: "Orders", required: true}, // changed from tour_id
    stars: {type: Number, required: true},
    comment: {type: String, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
});

const driverReview = model<IDriverReview>("DriverReviews", driverReviewSchema);

export default driverReview;