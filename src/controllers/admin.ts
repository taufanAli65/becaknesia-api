import { Request, Response, NextFunction } from "express";
import { assignDriverRoleService, getUsersByRoleService, getAdminDashboardStatsService } from "../services/admin";
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

export const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortRole = (req.query.sortRole as "driver" | "user") || "user";
        const result = await getUsersByRoleService(page, limit, sortRole);
        return sendSuccess(res, 200, "Users fetched successfully", result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
};

export const getAdminDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await getAdminDashboardStatsService();
        return sendSuccess(res, 200, "Dashboard stats fetched successfully", stats);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
};
