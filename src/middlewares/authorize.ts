import { Request, Response, NextFunction } from "express";
import { userRoles } from "../models/users";
import { AppError } from "../utils/appError";

export function authorize(...allowedRoles: userRoles[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw AppError("Forbidden: insufficient permissions", 403);
    }
    next();
  };
}
