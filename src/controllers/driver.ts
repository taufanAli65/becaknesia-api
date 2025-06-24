import { Request, Response, NextFunction } from "express";
import { addAvailabilitiesService } from "../services/driver"
import { sendSuccess, sendFail } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { addAvailabilitiesSchema } from "../validators/driver";

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