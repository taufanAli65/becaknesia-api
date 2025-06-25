import { Schema, model, Types } from "mongoose";

export interface IDriverReview {
    user_id: Types.ObjectId,
    driver_id: Types.ObjectId,
    tour_id: Types.ObjectId, // added
    stars: number,
    comment: string,
    created_at: Date,
    updated_at: Date
}

const driverReviewSchema = new Schema({
    user_id: {type: Types.ObjectId, ref: "Users", required: true}, // The one who's write the review
    driver_id: {type: Types.ObjectId, ref: "Drivers", required: true}, // The one who's getting reviewed
    tour_id: {type: Types.ObjectId, ref: "Tours", required: true}, // added
    stars: {type: Number, required: true},
    comment: {type: String, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
});

const driverReview = model<IDriverReview>("DriverReviews", driverReviewSchema);

export default driverReview;