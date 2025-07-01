import { Request, Response, NextFunction } from "express";
import { createNewTourPackageService, getTourPackagesService, getTourPackageService, updateTourPackageService, deleteTourPackageService } from "../services/tour";
import { sendFail, sendSuccess } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { createNewTourPackageSchema, needTourIDSchema, updateTourPackageSchema } from "../validators/tour";
import { uploadPhoto } from "../helpers/supabaseUpload";

export const createNewTourPackage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let photo_url = "";
        if (req.file) {
            photo_url = await uploadPhoto("tour", req.file);
        } else {
            return sendFail(res, 400, "Photo is required");
        }

        // Parse the incoming data to ensure correct types
        const { route_name, description, duration, distances, routes, prices } = req.body;

        // Explicitly cast values to the expected types
        const parsedDuration = Number(duration);
        const parsedDistances = Number(distances);
        const parsedPrices = Number(prices);

        // Validate the rest of the fields except photo_url
        const { route_name: validatedRouteName, description: validatedDescription } = validate(
            createNewTourPackageSchema.omit({ photo_url: true }),
            {
                route_name,
                description,
                duration: parsedDuration,  // Pass parsed values
                distances: parsedDistances,
                routes,
                prices: parsedPrices
            }
        );

        // Call the service function
        await createNewTourPackageService(validatedRouteName, validatedDescription, parsedDuration, parsedDistances, routes, parsedPrices, photo_url);

        return sendSuccess(res, 200, "New tour package is created successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}


export const getAllTourPackages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await getTourPackagesService(page, limit, search);
    return sendSuccess(res, 200, "Tour packages fetched successfully", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

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

export const updateTourPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate tourID from route params
    const { tourID } = validate(needTourIDSchema, req.params);

    // Validate and parse the rest of the fields from the request body
    let { route_name, description, duration, distances, routes, prices } = req.body

    // Explicitly parse the numeric fields to ensure they are numbers
    const parsedDuration = Number(duration);
    const parsedDistances = Number(distances);
    const parsedPrices = Number(prices);

    // Check if the parsed values are NaN (Not a Number)
    if (isNaN(parsedDuration) || isNaN(parsedDistances) || isNaN(parsedPrices)) {
      throw new Error("Duration, distances, and prices must be valid numbers.");
    }

    // Fetch the current tour from the database (for existing photo_url)
    const currentTour = await getTourPackageService(tourID);
    if (!currentTour) {
      throw new Error("Tour not found.");
    }

    // If no new file is uploaded, retain the current photo_url
    let photo_url: string | undefined = req.file ? await uploadPhoto("tour", req.file) : currentTour.photo_url;

    // Call the service to update the tour package
    const updatedTour = await updateTourPackageService(
      tourID,
      route_name,
      description,
      parsedDuration,
      parsedDistances,
      routes,
      parsedPrices,
      photo_url // Use the existing photo_url if no new file is uploaded
    );

    // Send success response with updated tour
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