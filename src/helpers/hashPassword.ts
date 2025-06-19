import bcrypt from "bcrypt";
import { AppError } from "../utils/appError";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = Number(process.env.SALTROUNDS);
  if (isNaN(saltRounds)) {
    throw AppError("Invalid SALTROUNDS environment variable", 500);
  }
  return bcrypt.hash(password, saltRounds);
}
