import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userRoles } from '../models/users';
import { AppError } from '../utils/appError';

export interface AuthPayload {
    id: string,
    name: string,
    email: string,
    no_hp: string,
    role: userRoles,
    photoUrl: string,
    status: string
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError('Unauthorized access', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email, no_hp: decoded.no_hp, role: decoded.role, photoUrl: decoded.photoUrl, status: decoded.status };
    next();
  } catch (err) {
    throw AppError('Invalid token', 401);
  }
};