import User, { userRoles } from "../models/users";
import { AppError } from "../utils/appError";

export async function assignDriverRoleService(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
        throw AppError("User not found", 404);
    }
    if (user.role === userRoles.Driver) {
        throw AppError("User is already a driver", 400);
    }
    if (user.role === userRoles.Admin) {
        throw AppError("Admin cannot be assigned as a driver", 400);
    }
    user.role = userRoles.Driver;
    await user.save();
}
