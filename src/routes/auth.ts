import { Router, Request, Response, NextFunction } from "express";
import { activateUser, login, register, resendVerificationEmail } from "../controllers/auth";
import { authenticated } from "../middlewares/authenticated";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/register", upload.single("photo"), (req: Request, res: Response, next: NextFunction) => {register(req, res, next)});
router.get("/activate", authenticated, (req: Request, res: Response, next: NextFunction) => {activateUser(req, res, next)});
router.post("/resend-verification-email", authenticated, (req: Request, res: Response, next: NextFunction) => {resendVerificationEmail(req, res, next)});
router.post("/login", (req: Request, res: Response, next: NextFunction) => {login(req, res, next)});

export default router;