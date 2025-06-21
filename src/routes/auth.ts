import { Router, Request, Response, NextFunction } from "express";
import { activateUser, login, register, resendVerificationEmail } from "../controllers/auth";

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {register(req, res, next)});
router.get("/activate", (req: Request, res: Response, next: NextFunction) => {activateUser(req, res, next)});
router.post("/resend-verification-email", (req: Request, res: Response, next: NextFunction) => {resendVerificationEmail(req, res, next)});
router.post("/login", (req: Request, res: Response, next: NextFunction) => {login(req, res, next)});

export default router;