import { Schema, model, Types } from "mongoose";

export interface IDriverReview {
    user_id: Types.ObjectId,
    driver_id: Types.ObjectId,
    stars: number,
    comment: string,
    created_at: Date,
    updated_at: Date
}

const driverReviewSchema = new Schema({
    user_id: {type: Types.ObjectId, ref: "Users", required: true}, // The one who's write the review
    driver_id: {type: Types.ObjectId, ref: "Users", required: true}, // The one who's getting reviewed
    stars: {type: Number, required: true},
    comment: {type: String, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
});

const driverReview = model<IDriverReview>("driverReviews", driverReviewSchema);

export default driverReview;