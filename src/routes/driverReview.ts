import express, { Request, Response, NextFunction } from "express";
import {
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview
} from "../controllers/driverReview";
import { authenticated } from "../middlewares/authenticated";

const router = express.Router();

router.post("/", authenticated, (req: Request, res: Response, next: NextFunction) => {addReview(req, res, next)});
router.get("/", (req: Request, res: Response, next: NextFunction) => {getReviews(req, res, next)});
router.get("/:review_id", (req: Request, res: Response, next: NextFunction) => {getReview(req, res, next)});
router.put("/:review_id", authenticated, (req: Request, res: Response, next: NextFunction) => {updateReview(req, res, next)});
router.delete("/:review_id", authenticated, (req: Request, res: Response, next: NextFunction) => {deleteReview(req, res, next)});

export default router;
