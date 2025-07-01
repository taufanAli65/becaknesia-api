import { z } from "zod";

export const adminDriverAvailabilitiesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    days: z.string().optional(),
    times: z.string().optional(),
});
