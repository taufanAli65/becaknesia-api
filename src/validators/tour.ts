import { z } from "zod";

export const createNewTourPackageSchema = z.object({
    route_name: z.string().min(8, "Route name must be at least 8 characters long"),
    description: z.string().min(15, "Description must be at leat 15 charactes long"),
    duration: z.number(),
    distances: z.number(),
    routes: z.array(z.string()),
    prices: z.number()
})