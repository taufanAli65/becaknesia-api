import { Router, Request, Response, NextFunction } from "express";
import { activateUser, login, register, resendVerificationEmail, updateUser } from "../controllers/auth";
import { authenticated } from "../middlewares/authenticated";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/register", upload.single("photo"), (req: Request, res: Response, next: NextFunction) => {register(req, res, next)});
router.get("/activate", (req: Request, res: Response, next: NextFunction) => {activateUser(req, res, next)});
router.post("/resend-verification-email", (req: Request, res: Response, next: NextFunction) => {resendVerificationEmail(req, res, next)});
router.post("/login", (req: Request, res: Response, next: NextFunction) => {login(req, res, next)});
router.put("/update", authenticated, (req: Request, res: Response, next: NextFunction) => {updateUser(req, res, next)});

export default router;