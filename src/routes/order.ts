import { Router, Request, Response, NextFunction } from "express";
import { createOrder, getOrders, getOrder, updateOrder, deleteOrder, getAcceptedOrdersForDriver, getOrdersByUserID } from "../controllers/order";
import { authenticated } from "../middlewares/authenticated";
import { authorize } from "../middlewares/authorize";
import { userRoles } from "../models/users";

const router = Router();

router.post("/", authenticated, (req: Request, res: Response, next: NextFunction) => { createOrder(req, res, next) });
router.get("/", authenticated, authorize(userRoles.Admin), (req: Request, res: Response, next: NextFunction) => { getOrders(req, res, next) });
router.get("/:order_id", authenticated, (req: Request, res: Response, next: NextFunction) => { getOrder(req, res, next) });
router.put("/:order_id", authenticated, (req: Request, res: Response, next: NextFunction) => { updateOrder(req, res, next) });
router.delete("/:order_id", authenticated, (req: Request, res: Response, next: NextFunction) => { deleteOrder(req, res, next) });
router.get("/driver/accepted", authenticated, authorize(userRoles.Driver), (req: Request, res: Response, next: NextFunction) => { getAcceptedOrdersForDriver(req, res, next) });
router.get("/user/:user_id/all", authenticated, (req: Request, res: Response, next: NextFunction) => { getOrdersByUserID(req, res, next) });

export default router;
