import tourReview from "../models/tourReviews";
import { AppError } from "../utils/appError";

async function addReviewService(user_id: string, tour_id: string, stars: number, comment?: string) {
    if (!user_id) throw AppError("User ID is required", 400);
    if (!tour_id) throw AppError("Driver ID is required", 400);
    if (stars > 5 || stars <= 0) throw AppError("Input stars range start from 1-5", 400);
    const review = new tourReview({ user_id, tour_id, stars, comment });
    await review.save();
}

async function getReviewsService(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const reviews = await tourReview.find().skip(skip).limit(limit);
    const total = await tourReview.countDocuments();
    return {
        data: reviews,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

async function getReviewService(review_id: string) {
    if (!review_id) throw AppError("Review ID is required", 400);
    const review = await tourReview.findById(review_id);
    if (!review) throw AppError("There is no review with such ID", 404);
    return review;
}

async function updateReviewService(review_id: string, stars?: number, comment?: string) {
    if(!review_id) throw AppError("Review ID is required", 400);
    const updateFields: any = {};
    if (stars !== undefined) updateFields.stars = stars;
    if (comment !== undefined) updateFields.comment = comment;
    const updatedReview = await tourReview.findByIdAndUpdate(
        review_id,
        { $set: updateFields },
        { new: true, runValidators: true }
    );
    if (!updatedReview) {
        throw AppError("Review not found", 404);
    }
    return updatedReview
}

async function deleteReviewService(review_id: string) {
    if (!review_id) throw AppError("Review ID is required", 400);
    const review = await tourReview.findByIdAndDelete(review_id);
    if (!review) throw AppError("Review not found", 404);
    return review;
}

export {addReviewService, getReviewsService, getReviewService, updateReviewService, deleteReviewService}