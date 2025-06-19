import { Schema, model, Types } from "mongoose";

export interface IDriverReview {
    user_id: Types.ObjectId,
    driver_id: Types.ObjectId,
    stars: number,
    comment: string
}

const driverReviewSchema = new Schema({
    user_id: {type: Types.ObjectId, ref: "Users", required: true}, // The one who's write the review
    driver_id: {type: Types.ObjectId, ref: "Users", required: true}, // The one who's getting reviewed
    stars: {type: Number, required: true},
    comment: {type: String, required: true}
})

const driverReview = model<IDriverReview>("driverReviews", driverReviewSchema);

export default driverReview;