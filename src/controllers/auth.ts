import { Request, Response, NextFunction } from "express";
import { validate } from "../utils/validate";
import { activateUserService, registerService } from "../services/auth";
import { sendFail, sendSuccess } from "../utils/senResponse";
import { registerSchema, verifyEmailSchema } from "../validators/auth";

export const register = async(req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
    try {
        const { name, password, email, no_hp, role, photoUrl } = validate(registerSchema, req.body);
        await registerService(name, password, email, no_hp, role, photoUrl);
        return sendSuccess(res, 201, "Registration successful. Please check your email to verify your account.");
    } catch (error) {
        return sendFail(res, 400, "Registration failed", error);
    }
}

export const activateUser = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { token } = validate(verifyEmailSchema, req.query);
        await activateUserService(token as string);
        return sendSuccess(res, 200, "User activated successfully. You can now log in.");
    } catch (error) {
        return sendFail(res, 400, "Activation failed", error);
    }
}