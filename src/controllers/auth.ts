import { Request, Response, NextFunction } from "express";
import { validate } from "../utils/validate";
import { activateUserService, registerService, resendVerificationEmailService, loginService, updateUserService } from "../services/auth";
import { sendFail, sendSuccess } from "../utils/senResponse";
import { registerSchema, verifyEmailSchema, resendVerificationEmailSchema, loginSchema, changeDataSchema } from "../validators/auth";
import { uploadPhoto } from "../helpers/supabaseUpload";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, password, email, no_hp } = validate(registerSchema, req.body);
        let photoUrl = "";

        if (req.file) {
            photoUrl = await uploadPhoto("profile_photos", req.file);
        } else {
            return sendFail(res, 400, "Photo is required");
        }
        await registerService(name, password, email, no_hp, photoUrl);
        return sendSuccess(res, 201, "Registration successful. Please check your email to verify your account.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
};

export const activateUser = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { token } = validate(verifyEmailSchema, req.query);
        await activateUserService(token as string);
        return sendSuccess(res, 200, "User activated successfully. You can now log in.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const resendVerificationEmail = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email } = validate(resendVerificationEmailSchema, req.body);
        if (!email) {
            return sendFail(res, 400, "Email is required");
        }
        await resendVerificationEmailService(email);
        return sendSuccess(res, 200, "Verification email sent successfully. Please check your inbox.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const login = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, password } = validate(loginSchema, req.body);
        const token = await loginService(email, password);
        return sendSuccess(res, 200, "Login successful", { "token": token });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return sendFail(res, 401, "Unauthorized access");
        }
        const { name, email, no_hp, photoUrl } = validate(changeDataSchema, req.body);
        await updateUserService(userId, { name, email, no_hp, photoUrl });
        return sendSuccess(res, 200, "User updated successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
    }
}