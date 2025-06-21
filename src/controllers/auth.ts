import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { validate } from "../utils/validate";
import { registerService } from "../services/auth";
import { userRoles } from "../models/users";
import { sendSuccess } from "../utils/senResponse";
import { registerSchema } from "../validators/auth";

export const register = async(req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
    try {
        const { name, password, email, no_hp, roles, photoUrl } = validate(registerSchema, req.body);
        await registerService(name, password, email, no_hp, roles, photoUrl);
        return sendSuccess(res, 201, "Registration successful. Please check your email to verify your account.");
    } catch (error) {
        throw AppError("An error occurred during registration", 500, error);
    }
}