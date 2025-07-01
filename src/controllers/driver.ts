import { Request, Response, NextFunction } from "express";
import {
    addAvailabilitiesService,
    getDriverAvailabilitiesService,
    searchDriverAvailabilitiesService,
    updateDriverAvailabilityService,
    deleteDriverAvailabilityService
} from "../services/driver"
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
        const driver_id = req.user.id;
        const response = await getDriverAvailabilitiesService(driver_id);
        return sendSuccess(res, 200, "Get driver availabilities successfully", response);
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

export const updateDriverAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driver_id = req.user.id;
        const { availability_id } = req.params;
        const { days, times } = req.body;
        const updated = await updateDriverAvailabilityService(driver_id, availability_id, days, times);
        return sendSuccess(res, 200, "Availability updated successfully", updated);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const deleteDriverAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driver_id = req.user.id;
        const { availability_id } = req.params;
        await deleteDriverAvailabilityService(driver_id, availability_id);
        return sendSuccess(res, 200, "Availability deleted successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}