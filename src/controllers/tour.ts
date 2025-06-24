import { Request, Response, NextFunction } from "express";
import { createNewTourPackageService, getTourPackagesService, getTourPackageService, updateTourPackageService, deleteTourPackageService } from "../services/tour";
import { sendFail, sendSuccess } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { createNewTourPackageSchema, needTourIDSchema, updateTourPackageSchema } from "../validators/tour";
import { uploadProfilePhoto } from "../helpers/supabaseUpload";

export const createNewTourPackage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let photo_url = "";
        if (req.file) {
            photo_url = await uploadProfilePhoto("tour", req.file);
        } else {
            return sendFail(res, 400, "Photo is required");
        }
        // Validate the rest of the fields except photo_url
        const {route_name, description, duration, distances, routes, prices} = validate(
            createNewTourPackageSchema.omit({ photo_url: true }),
            req.body
        );
        await createNewTourPackageService(route_name, description, duration, distances, routes, prices, photo_url);
        return sendSuccess(res, 200, "New tour package is created successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const getAllTourPackages = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // default = 1;
        const limit = parseInt(req.query.limit as string) || 10 // default = 10;
        
        const result = await getTourPackagesService(page, limit);
        return sendSuccess(res, 200, "Tour packages fetched successfully", result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const getTourPackage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {tourID} = validate(needTourIDSchema, req.params);
        const tour = await getTourPackageService(tourID);
        return sendSuccess(res, 200, `Tour package with ID: ${tourID} fetched successfully`, tour);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const updateTourPackage = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {tourID} = validate(needTourIDSchema, req.params);
    const {route_name, description, duration, distances, routes, prices} = validate(updateTourPackageSchema, req.body);
    const updatedTour = await updateTourPackageService(tourID, route_name, description, duration, distances, routes, prices);
    return sendSuccess(res, 200, "Tour package updated successfully", updatedTour);
  } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
  }
};

export const deletedTourPackage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {tourID} = validate(needTourIDSchema, req.params);
        const deletedTourPackage = await deleteTourPackageService(tourID);
        return sendSuccess(res, 200, "Tour package deleted successfully", deletedTourPackage);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}