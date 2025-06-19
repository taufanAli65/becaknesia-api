import { ZodFormattedError } from "zod";

export function flattenZodError(
  error: ZodFormattedError<any>
): Record<string, string> {
  const result: Record<string, string> = {};

  // kita abaikan _errors di root
  Object.entries(error).forEach(([key, value]) => {
    if (key === "_errors") return;

    // pastikan value adalah object yang memiliki _errors
    const field = value as { _errors?: string[] };
    if (field._errors && field._errors.length > 0) {
      result[key] = field._errors[0];
    }
  });

  return result;
}