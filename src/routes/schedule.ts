import { Router, Request, Response, NextFunction } from "express";
import { createSchedule, getSchedules, getSchedule, updateSchedule, deleteSchedule } from "../controllers/schedule";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";

const router = Router();

router.post("/", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => { createSchedule(req, res, next) });
router.get("/", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => { getSchedules(req, res, next) });
router.get("/:schedule_id", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => { getSchedule(req, res, next) });
router.put("/:schedule_id", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => { updateSchedule(req, res, next) });
router.delete("/:schedule_id", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => { deleteSchedule(req, res, next) });

export default router;
