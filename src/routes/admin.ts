import { Router, Request, Response, NextFunction } from "express";
import { assignDriverRole, getUsersByRole, getAdminDashboardStats } from "../controllers/admin";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";

const router = Router();

router.post("/assign-driver", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {assignDriverRole(req, res, next)});
router.get("/users", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {getUsersByRole(req, res, next)});
router.get("/dashboard/stats", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {getAdminDashboardStats(req, res, next)});

export default router;
