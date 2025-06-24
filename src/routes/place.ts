import { Router, Request, Response, NextFunction } from "express";
import { createPlace, getPlaces, getPlace, updatePlace, deletePlace } from "../controllers/place";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", authenticated, authorize(userRoles.Admin), upload.single("photo"), (req: Request, res: Response, next: NextFunction) => {createPlace(req, res, next)});
router.get("/", (req: Request, res: Response, next: NextFunction) => {getPlaces(req, res, next)});
router.get("/:place_id", (req: Request, res: Response, next: NextFunction) => {getPlace(req, res, next)});
router.put("/:place_id", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {updatePlace(req, res, next)});
router.delete("/:place_id", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {deletePlace(req, res, next)});

export default router;