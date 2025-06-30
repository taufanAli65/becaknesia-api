import { Request, Response, NextFunction } from "express";
import { addAvailabilitiesService, getDriverAvailabilitiesService, searchDriverAvailabilitiesService } from "../services/driver"
import { sendSuccess, sendFail } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { addAvailabilitiesSchema, objectIdSchema, searchAvailabilitiesSchema } from "../validators/driver";

export const addAvailabilities = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { driver_id, days, times } = validate(addAvailabilitiesSchema, req.body);
        const data = { driver_id, days, times }
        const response = await addAvailabilitiesService(data);
        return sendSuccess(res, 200, "Add availabilities successfully", response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const getDriverAvailabilities = async(req: Request, res: Response, next:  NextFunction) => {
    try {
        const driver_id = validate(objectIdSchema, req.body);
        const response = await getDriverAvailabilitiesService(driver_id)
        return sendSuccess(res, 200, "Get driver availabilities successfully")
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const searchDriverAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { days, times } = validate(searchAvailabilitiesSchema, req.body);
        const response = await searchDriverAvailabilitiesService({ days, times });
        return sendSuccess(res, 200, "Search driver availabilities successfully", response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}