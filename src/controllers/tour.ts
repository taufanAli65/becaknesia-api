import { Request, Response, NextFunction } from "express";
import { createNewTourPackageService } from "../services/tour";
import { sendFail, sendSuccess } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { createNewTourPackageSchema } from "../validators/tour";

export const createNewTourPackage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {route_name, description, duration, distances, routes,prices} = validate(createNewTourPackageSchema, req.body);
        await createNewTourPackageService(route_name, description, duration, distances, routes,prices);
        return sendSuccess(res, 200, "New tour package is created successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}