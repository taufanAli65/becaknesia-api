import Order from "../models/orders";
import { AppError } from "../utils/appError";

async function createOrderService(user_id: string, tour_id: string, payment_method: string, total: string, pickup_location: string, pickup_time: string) {
  const order = new Order({ user_id, tour_id, payment_method, total, pickup_location, pickup_time });
  await order.save();
  return order;
}

async function getOrdersService(page: number = 1, limit: number = 10, search?: string) {
  const skip = (page - 1) * limit;
  const query: any = {};
  if (search) {
        query.$or = [
        { user_id: { $regex: search, $options: "i" } }, // case-insensitive
        { order_status: { $regex: search, $options: "i" } },
        { payment_status: { $regex: search, $options: "i" } }
        ];
    }
  const orders = await Order.find(query).skip(skip).limit(limit);
  const total = await Order.countDocuments(query);
  return {
    data: orders,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

async function getOrderService(order_id: string) {
  if (!order_id) throw AppError("Order ID is required", 400);
  const order = await Order.findById(order_id);
  if (!order) throw AppError("Order not found", 404);
  return order;
}

async function updateOrderService(order_id: string, updateData: any) {
  if (!order_id) throw AppError("Order ID is required", 400);
  const updatedOrder = await Order.findByIdAndUpdate(order_id, { $set: updateData }, { new: true, runValidators: true });
  if (!updatedOrder) throw AppError("Order not found", 404);
  return updatedOrder;
}

async function deleteOrderService(order_id: string) {
  if (!order_id) throw AppError("Order ID is required", 400);
  const deletedOrder = await Order.findByIdAndDelete(order_id);
  if (!deletedOrder) throw AppError("Order not found", 404);
  return deletedOrder;
}

export { createOrderService, getOrdersService, getOrderService, updateOrderService, deleteOrderService };
