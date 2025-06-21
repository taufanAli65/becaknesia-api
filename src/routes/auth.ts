import { Router, Request, Response, NextFunction } from "express";
import { register } from "../controllers/auth";

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {register(req, res, next)});

export default router;