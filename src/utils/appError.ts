export function AppError(message: string, statusCode: number, data?: any) {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  error.isOperational = true;
  if (data) error.data = data;
  return error;
}