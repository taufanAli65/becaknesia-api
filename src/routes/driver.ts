import { Router, Request, Response, NextFunction } from "express";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";
import { addAvailabilities } from "../controllers/driver";

const router = Router();

router.post("/available", authenticated, authorize(userRoles.Driver), (req: Request, res: Response, next: NextFunction) => {addAvailabilities(req, res, next)});

export default router;