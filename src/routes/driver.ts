import { Router, Request, Response, NextFunction } from "express";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";
import {
    addAvailabilities,
    searchDriverAvailabilities,
    getDriverAvailabilities,
    updateDriverAvailability,
    deleteDriverAvailability
} from "../controllers/driver";

const router = Router();

router.post("/availability", authenticated, authorize(userRoles.Driver), (req: Request, res: Response, next: NextFunction) => {addAvailabilities(req, res, next)});
router.post("/availability/search", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {searchDriverAvailabilities(req, res, next)});
router.get("/availability", authenticated, authorize(userRoles.Driver), (req: Request, res: Response, next: NextFunction) => {getDriverAvailabilities(req, res, next)});
router.put("/availability/:availability_id", authenticated, authorize(userRoles.Driver), (req: Request, res: Response, next: NextFunction) => {updateDriverAvailability(req, res, next)});
router.delete("/availability/:availability_id", authenticated, authorize(userRoles.Driver), (req: Request, res: Response, next: NextFunction) => {deleteDriverAvailability(req, res, next)});

export default router;