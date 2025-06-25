import { Request, Response, NextFunction } from "express";
import { addReviewService, getReviewsService, getReviewService, updateReviewService, deleteReviewService } from "../services/driverReview";
import { sendSuccess, sendFail } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { addReviewSchema, needReviewIDSchema, updateReviewSchema } from "../validators/driverReview";
import Driver from "../models/drivers";
import { AppError } from "../utils/appError";

export const addReview = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user.id;
        const {driver_id, tour_id, stars, comment} = validate(addReviewSchema, req.body);
        const driver = Driver.findById(driver_id);
        if(!driver) throw AppError("There is no driver with such ID", 404);
        await addReviewService(user_id, driver_id, tour_id, stars, comment);
        return sendSuccess(res, 201, "Review added successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const result = await getReviewsService(page, limit, search);
    return sendSuccess(res, 200, "Reviews fetched successfully", result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return sendFail(res, 400, message, error);
  }
};

export const getReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { review_id } = validate(needReviewIDSchema, req.params);
    const review = await getReviewService(review_id);
    return sendSuccess(res, 200, "Review fetched successfully", review);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return sendFail(res, 400, message, error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { review_id } = validate(needReviewIDSchema, req.params);
    const { stars, comment } = validate(updateReviewSchema, req.body);

    const updated = await updateReviewService(review_id, stars, comment);
    return sendSuccess(res, 200, "Review updated successfully", updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return sendFail(res, 400, message, error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { review_id } = validate(needReviewIDSchema, req.params);
    await deleteReviewService(review_id);
    return sendSuccess(res, 200, "Review deleted successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return sendFail(res, 400, message, error);
  }
};