import { Router, Request, Response, NextFunction } from "express";
import { createNewTourPackage } from "../controllers/tour";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";

const router = Router();

router.post("/", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {createNewTourPackage(req, res, next)});

export default router;