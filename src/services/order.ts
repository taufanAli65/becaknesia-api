import Order from "../models/orders";
import Schedule from "../models/schedules";
import Tour from "../models/tours";
import { AppError } from "../utils/appError";

async function createOrderService(user_id: string, tour_id: string, payment_method: string, total: number, pickup_location: string, pickup_time: string, pickup_date: string) {
  const order = new Order({ user_id, tour_id, payment_method, total, pickup_location, pickup_time, pickup_date });
  await order.save();
  // Fetch the tour to get the route_name
  const tour = await Tour.findById(tour_id);
  const tour_name = tour ? tour.route_name : null;
  return { ...order.toObject(), tour_name };
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
  const orders = await Order.findById(order_id ).populate("tour_id", "route_name");
  if (!orders) {
    return [];
  }
  // Map orders to include tour_name at top level
  const ordersWithTourName = [orders].map(order => {
    const obj = order.toObject() as any;
    obj.tour_name = obj.tour_id && typeof obj.tour_id === "object" && "route_name" in obj.tour_id
      ? (obj.tour_id as { route_name?: string }).route_name
      : null;
    return obj;
  });
  return ordersWithTourName;
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

async function getAcceptedOrdersForDriverService(driver_id: string, page: number = 1, limit: number = 10, search?: string) {
  if (!driver_id) throw AppError("Driver ID is required", 400);
  const skip = (page - 1) * limit;

  // Find schedules for this driver
  const scheduleQuery: any = { driver_id };
  const schedules = await Schedule.find(scheduleQuery).select("order_id");

  const orderIds = schedules.map(s => s.order_id);

  // Build order query
  const orderQuery: any = {
    _id: { $in: orderIds },
    order_status: "accepted"
  };
  if (search) {
    orderQuery.$or = [
      { pickup_location: { $regex: search, $options: "i" } },
      { pickup_time: { $regex: search, $options: "i" } }
    ];
  }

  // Populate tour_id and user_id to get route_name and user name
  const orders = await Order.find(orderQuery)
    .skip(skip)
    .limit(limit)
    .populate("tour_id", "route_name")
    .populate("user_id", "name")
    .lean();

  // Attach schedule info, tour_name, and user_name to each order
  const schedulesMap = new Map();
  schedules.forEach(s => schedulesMap.set(String(s.order_id), s));
  const data = orders.map(order => ({
    ...order,
    schedule: schedulesMap.get(String(order._id)) || null,
    tour_name: order.tour_id && typeof order.tour_id === "object" && "route_name" in order.tour_id
      ? (order.tour_id as { route_name?: string }).route_name
      : null,
    user_name: order.user_id && typeof order.user_id === "object" && "name" in order.user_id
      ? (order.user_id as { name?: string }).name
      : null
  }));

  const total = await Order.countDocuments(orderQuery);
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

async function getOrdersByUserIDService(user_id: string) {
  if (!user_id) throw AppError("User ID is required", 400);
  // Populate the tour_id to get route_name (tour_name)
  const orders = await Order.find({ user_id }).populate("tour_id", "route_name");
  // Map orders to include tour_name at top level
  const ordersWithTourName = orders.map(order => {
    const obj = order.toObject() as any;
    obj.tour_name = obj.tour_id && typeof obj.tour_id === "object" && "route_name" in obj.tour_id
      ? (obj.tour_id as { route_name?: string }).route_name
      : null;
    return obj;
  });
  return ordersWithTourName;
}

async function getWaitingOrdersService(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const query = { order_status: "waiting" };
  const orders = await Order.find(query).skip(skip).limit(limit).populate("tour_id", "route_name");
  const total = await Order.countDocuments(query);
  // Add tour_name to each order
  const ordersWithTourName = orders.map(order => {
    const obj = order.toObject() as any;
    obj.tour_name = obj.tour_id && typeof obj.tour_id === "object" && "route_name" in obj.tour_id
      ? (obj.tour_id as { route_name?: string }).route_name
      : null;
    return obj;
  });
  return {
    data: ordersWithTourName,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export { 
  createOrderService, 
  getOrdersService, 
  getOrderService, 
  updateOrderService, 
  deleteOrderService,
  getAcceptedOrdersForDriverService,
  getOrdersByUserIDService,
  getWaitingOrdersService
};
