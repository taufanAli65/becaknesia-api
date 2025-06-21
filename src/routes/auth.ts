import { Router, Request, Response, NextFunction } from "express";
import { activateUser, register } from "../controllers/auth";

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {register(req, res, next)});
router.get("/activate", (req: Request, res: Response, next: NextFunction) => {activateUser(req, res, next)});

export default router;