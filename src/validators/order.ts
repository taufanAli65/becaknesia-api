import mongoose from "mongoose";
import { z } from "zod";
import { orderStatus, paymentStatus, paymentMethod } from "../models/orders";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ID, check again",
});

export const createOrderSchema = z.object({
  tour_id: objectIdSchema,
  payment_method: z.nativeEnum(paymentMethod),
  total: z.number().min(1, "Total is required"),
  pickup_location: z.string().min(1, "Pickup location is required"),
  pickup_time: z.string().min(1, "Pickup time is required"),
  pickup_date: z.string().min(1, "Pickup date is required"),
});

export const updateOrderSchema = z.object({
  order_status: z.nativeEnum(orderStatus).optional(),
  payment_status: z.nativeEnum(paymentStatus).optional(),
  pickup_location: z.string().optional(),
  pickup_time: z.string().optional(),
});

export const needOrderIDSchema = z.object({
  order_id: objectIdSchema,
});

export const searchAcceptedOrdersSchema = z.object({
  driver_id: objectIdSchema,
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  search: z.string().optional()
});

export const getOrdersByUserIDSchema = z.object({
  user_id: objectIdSchema,
});

export const getWaitingOrdersSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
});
