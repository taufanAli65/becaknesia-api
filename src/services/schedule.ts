import Schedule from "../models/schedules";
import Order, { paymentStatus, orderStatus } from "../models/orders";
import Driver from "../models/drivers";
import { AppError } from "../utils/appError";
import { Types } from "mongoose";
import { startOfWeek, endOfWeek, parseISO } from "date-fns";

async function createScheduleService(order_id: string, driver_id: string, times: string, available?: boolean) {
  // Check if order exists and is paid and not done
  const order = await Order.findById(order_id);
  if (!order) throw AppError("Order not found", 404);
  if (order.payment_status !== paymentStatus.Success) throw AppError("Order is not paid", 400);
  if (order.order_status === orderStatus.Done) throw AppError("Order is already done", 400);

  // Ensure only one driver per order
  const existingSchedule = await Schedule.findOne({ order_id });
  if (existingSchedule) throw AppError("This order already has a driver assigned", 400);

  // Ensure driver exists
  const driver = await Driver.findById(driver_id);
  if (!driver) throw AppError("Driver not found", 404);

  // Ensure driver is not assigned to another order at the same time
  const driverAssigned = await Schedule.findOne({ driver_id, times });
  if (driverAssigned) throw AppError("Driver is already assigned to another order at this time", 400);

  const schedule = new Schedule({
    order_id,
    driver_id,
    times,
    available: available ?? true
  });
  await schedule.save();
  return schedule;
}

async function getSchedulesService(page: number = 1, limit: number = 10, week?: string) {
  const skip = (page - 1) * limit;
  let filter: any = {};

  if (week) {
    // week can be an ISO date string or "YYYY-Www" (ISO week string)
    let weekStart: Date, weekEnd: Date;
    try {
      const baseDate = parseISO(week);
      weekStart = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
      weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
      filter.times = { $gte: weekStart.toISOString(), $lte: weekEnd.toISOString() };
    } catch {
      // fallback: ignore filter if invalid
    }
  }

  const schedules = await Schedule.find(filter).skip(skip).limit(limit);
  const total = await Schedule.countDocuments(filter);
  return {
    data: schedules,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

async function getScheduleService(schedule_id: string) {
  const schedule = await Schedule.findById(schedule_id);
  if (!schedule) throw AppError("Schedule not found", 404);
  return schedule;
}

async function updateScheduleService(schedule_id: string, updateData: any) {
  const schedule = await Schedule.findById(schedule_id);
  if (!schedule) throw AppError("Schedule not found", 404);

  // If updating driver_id or order_id, re-check constraints
  if (updateData.order_id && updateData.order_id !== schedule.order_id.toString()) {
    const order = await Order.findById(updateData.order_id);
    if (!order) throw AppError("Order not found", 404);
    if (order.payment_status !== paymentStatus.Success) throw AppError("Order is not paid", 400);
    if (order.order_status === orderStatus.Done) throw AppError("Order is already done", 400);
    const existingSchedule = await Schedule.findOne({ order_id: updateData.order_id });
    if (existingSchedule) throw AppError("This order already has a driver assigned", 400);
  }
  if (updateData.driver_id && updateData.driver_id !== schedule.driver_id.toString()) {
    const driver = await Driver.findById(updateData.driver_id);
    if (!driver) throw AppError("Driver not found", 404);
    const driverAssigned = await Schedule.findOne({ driver_id: updateData.driver_id, times: updateData.times ?? schedule.times });
    if (driverAssigned) throw AppError("Driver is already assigned to another order at this time", 400);
  }
  if (updateData.times) {
    const driverAssigned = await Schedule.findOne({ driver_id: updateData.driver_id ?? schedule.driver_id, times: updateData.times, _id: { $ne: schedule_id } });
    if (driverAssigned) throw AppError("Driver is already assigned to another order at this time", 400);
  }

  const updated = await Schedule.findByIdAndUpdate(schedule_id, { $set: updateData }, { new: true, runValidators: true });
  return updated;
}

async function deleteScheduleService(schedule_id: string) {
  const deleted = await Schedule.findByIdAndDelete(schedule_id);
  if (!deleted) throw AppError("Schedule not found", 404);
  return deleted;
}

async function getDriverAcceptedSchedulesService(driver_id: string, week?: string) {
  // Validate driver_id
  if (!driver_id) throw AppError("Driver ID is required", 400);

  let filter: any = { driver_id };
  if (week) {
    try {
      const baseDate = parseISO(week);
      const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
      filter.times = { $gte: weekStart.toISOString(), $lte: weekEnd.toISOString() };
    } catch {
      // ignore week filter if invalid
    }
  }

  // Join with orders to filter by order_status
  const schedules = await Schedule.find(filter)
    .populate({
      path: "order_id",
      match: { order_status: orderStatus.Accepted }
    });

  // Only return schedules where order is accepted
  const acceptedSchedules = schedules.filter(s => s.order_id);

  return acceptedSchedules;
}

export {
  createScheduleService,
  getSchedulesService,
  getScheduleService,
  updateScheduleService,
  deleteScheduleService,
  getDriverAcceptedSchedulesService,
};
