import { Request, Response, NextFunction } from "express";
import { assignDriverRoleService } from "../services/admin";
import { sendFail, sendSuccess } from "../utils/senResponse";

export const assignDriverRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.id;
        if (!userId) {
            return sendFail(res, 401, "There is no user id provided");
        }
        await assignDriverRoleService(userId);
        return sendSuccess(res, 200, "User assigned driver role successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
};
