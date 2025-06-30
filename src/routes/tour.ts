import { Router, Request, Response, NextFunction } from "express";
import { createNewTourPackage, getAllTourPackages, getTourPackage, updateTourPackage, deletedTourPackage } from "../controllers/tour";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", authenticated, authorize(userRoles.Admin), upload.single("photo"), (req: Request, res: Response, next: NextFunction) => {createNewTourPackage(req, res, next)});
router.get("/", (req: Request, res: Response, next: NextFunction) => {getAllTourPackages(req, res, next)});
router.get("/:tourID", (req: Request, res: Response, next: NextFunction) => {getTourPackage(req, res, next)});
router.put("/:tourID", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {updateTourPackage(req, res, next)});
router.delete("/:tourID", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => {deletedTourPackage(req, res, next)});

export default router;