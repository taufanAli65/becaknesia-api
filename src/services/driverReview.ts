import driverReview from "../models/driverReviews";
import { AppError } from "../utils/appError";

async function addReviewService(user_id: string, driver_id: string, stars: number, comment?: string) {
    if (!user_id) throw AppError("User ID is required", 400);
    if (!driver_id) throw AppError("Driver ID is required", 400);
    if (stars > 5 || stars <= 0) throw AppError("Input stars range start from 1-5", 400);
    const review = new driverReview({ user_id, driver_id, stars, comment });
    await review.save();
}

async function getReviewsService(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (search) {
        query.$or = [
        { driver_id: { $regex: search, $options: "i" } } // case-insensitive
        ];
    }
    const reviews = await driverReview.find(query).skip(skip).limit(limit);
    const total = await driverReview.countDocuments(query);
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
    const review = await driverReview.findById(review_id);
    if (!review) throw AppError("There is no review with such ID", 404);
    return review;
}

async function updateReviewService(review_id: string, stars?: number, comment?: string) {
    if(!review_id) throw AppError("Review ID is required", 400);
    const updateFields: any = {};
    if (stars !== undefined) updateFields.stars = stars;
    if (comment !== undefined) updateFields.comment = comment;
    const updatedReview = await driverReview.findByIdAndUpdate(
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
    const review = await driverReview.findByIdAndDelete(review_id);
    if (!review) throw AppError("Review not found", 404);
    return review;
}

export {addReviewService, getReviewsService, getReviewService, updateReviewService, deleteReviewService}