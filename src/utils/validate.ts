import { ZodSchema } from "zod";
import { AppError } from "./appError";
import { flattenZodError } from "./flattenZodError";

export function validate<T>(schema: ZodSchema<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const formatted = flattenZodError(result.error.format());
    throw AppError("Validation failed", 400, formatted);
  }
  return result.data;
}