import { Schema, model, Types } from "mongoose";

export interface ITourReview extends Document {
    user_id: Types.ObjectId,
    tour_id: Types.ObjectId,
    stars: number,
    comment: string,
    created_at: Date,
    updated_at: Date
}

const tourReviewSchema = new Schema({
    user_id: {type: Types.ObjectId, ref: "Users", required: true},
    tour_id: {type: Types.ObjectId, ref: "Tours", required: true},
    stars: {type: Number, required: true},
    comment: {type: String, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
});

const TourReview = model<ITourReview>("tourReviews", tourReviewSchema);

export default TourReview;