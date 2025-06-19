import { Response } from "express";

type ResponseStatus = "success" | "fail";

interface ApiResponse<T> {
  status: ResponseStatus;
  message: string;
  data: T | null;
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): Response {
  const response: ApiResponse<T> = {
    status: "success",
    message,
    data,
  };

  return res.status(statusCode).json(response);
}

export function sendFail(
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
): Response {
  const response: ApiResponse<any> = {
    status: "fail",
    message,
    data,
  };

  return res.status(statusCode).json(response);
}