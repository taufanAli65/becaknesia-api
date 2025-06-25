import { Router, Request, Response, NextFunction } from "express";
import { createOrder, getOrders, getOrder, updateOrder, deleteOrder } from "../controllers/order";
import { authenticated } from "../middlewares/authenticated";

const router = Router();

router.post("/", authenticated, (req: Request, res: Response, next: NextFunction) => { createOrder(req, res, next) });
router.get("/", authenticated, (req: Request, res: Response, next: NextFunction) => { getOrders(req, res, next) });
router.get("/:order_id", authenticated, (req: Request, res: Response, next: NextFunction) => { getOrder(req, res, next) });
router.put("/:order_id", authenticated, (req: Request, res: Response, next: NextFunction) => { updateOrder(req, res, next) });
router.delete("/:order_id", authenticated, (req: Request, res: Response, next: NextFunction) => { deleteOrder(req, res, next) });

export default router;
