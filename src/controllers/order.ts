import { Request, Response, NextFunction } from "express";
import { createOrderService, getOrdersService, getOrderService, updateOrderService, deleteOrderService, getAcceptedOrdersForDriverService, getOrdersByUserIDService, getWaitingOrdersService } from "../services/order";
import { sendSuccess, sendFail } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { createOrderSchema, updateOrderSchema, needOrderIDSchema, searchAcceptedOrdersSchema, getOrdersByUserIDSchema, getWaitingOrdersSchema } from "../validators/order";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user.id;
    const { tour_id, payment_method, total, pickup_location, pickup_time, pickup_date } = validate(createOrderSchema, req.body);
    const order = await createOrderService(user_id, tour_id, payment_method, total, pickup_location, pickup_time, pickup_date);
    return sendSuccess(res, 201, "Order created successfully", order);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const result = await getOrdersService(page, limit, search);
    return sendSuccess(res, 200, "Orders fetched successfully", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id } = validate(needOrderIDSchema, req.params);
    const order = await getOrderService(order_id);
    return sendSuccess(res, 200, "Order fetched successfully", order);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id } = validate(needOrderIDSchema, req.params);
    const updateData = validate(updateOrderSchema, req.body);
    const updatedOrder = await updateOrderService(order_id, updateData);
    return sendSuccess(res, 200, "Order updated successfully", updatedOrder);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id } = validate(needOrderIDSchema, req.params);
    await deleteOrderService(order_id);
    return sendSuccess(res, 200, "Order deleted successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const getAcceptedOrdersForDriver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const driver_id = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    validate(searchAcceptedOrdersSchema, { driver_id, page, limit, search });
    const result = await getAcceptedOrdersForDriverService(driver_id, page, limit, search);
    return sendSuccess(res, 200, "Accepted orders fetched successfully", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const getOrdersByUserID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = validate(getOrdersByUserIDSchema, req.params);
    // Only allow the user to access their own orders
    if (req.user.id !== user_id) {
      return sendFail(res, 403, "Forbidden: You can only access your own orders");
    }
    const orders = await getOrdersByUserIDService(user_id);
    return sendSuccess(res, 200, "Orders fetched successfully", orders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const getWaitingOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = validate(getWaitingOrdersSchema, req.query);
    const result = await getWaitingOrdersService(page, limit);
    return sendSuccess(res, 200, "Waiting orders fetched successfully", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};
