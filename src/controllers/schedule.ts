import { Request, Response, NextFunction } from "express";
import { createScheduleService, getSchedulesService, getScheduleService, updateScheduleService, deleteScheduleService, getDriverAcceptedSchedulesService } from "../services/schedule";
import { sendSuccess, sendFail } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { createScheduleSchema, updateScheduleSchema, needScheduleIDSchema, searchDriverSchedulesSchema } from "../validators/schedule";

export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, driver_id, times, available } = validate(createScheduleSchema, req.body);
    const schedule = await createScheduleService(order_id, driver_id, times, available);
    return sendSuccess(res, 201, "Schedule created successfully", schedule);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const getSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const week = req.query.week as string | undefined;
    const result = await getSchedulesService(page, limit, week);
    return sendSuccess(res, 200, "Schedules fetched successfully", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const getSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { schedule_id } = validate(needScheduleIDSchema, req.params);
    const schedule = await getScheduleService(schedule_id);
    return sendSuccess(res, 200, "Schedule fetched successfully", schedule);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { schedule_id } = validate(needScheduleIDSchema, req.params);
    const updateData = validate(updateScheduleSchema, req.body);
    const updated = await updateScheduleService(schedule_id, updateData);
    return sendSuccess(res, 200, "Schedule updated successfully", updated);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { schedule_id } = validate(needScheduleIDSchema, req.params);
    await deleteScheduleService(schedule_id);
    return sendSuccess(res, 200, "Schedule deleted successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const searchDriverSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const driver_id = req.user.id;
    const week = req.query.week as string | undefined;
    // Validate driver_id and week
    validate(searchDriverSchedulesSchema, { driver_id, week });
    const schedules = await getDriverAcceptedSchedulesService(driver_id, week);
    return sendSuccess(res, 200, "Accepted schedules fetched successfully", schedules);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};
