import { z } from "zod";
import { userRoles } from "../models/users";

export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address"),
    no_hp: z.string().min(10, "Phone number must be at least 10 characters long"),
    role: z.nativeEnum(userRoles, {
        errorMap: () => ({ message: "Invalid role" })
    })
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, "Verification token cannot be empty")
});

export const resendVerificationEmailSchema = z.object({
    email: z.string().email("Invalid email address")
});

export const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    confirmNewPassword: z.string().min(6, "Confirm new password must be at least 6 characters long")
}).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "New password and confirm new password must match",
    });