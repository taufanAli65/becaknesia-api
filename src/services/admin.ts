import mongoose from "mongoose";
import User, { userRoles } from "../models/users";
import { AppError } from "../utils/appError";
import Driver from "../models/drivers";
import Order from "../models/orders";

export async function assignDriverRoleService(userId: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw AppError("User not found", 404);
        }
        if (user.role === userRoles.Driver) {
            throw AppError("User is already a driver", 400);
        }
        if (user.role === userRoles.Admin) {
            throw AppError("Admin cannot be assigned as a driver", 400);
        }
        // Update user role
        user.role = userRoles.Driver;
        await user.save({ session });

        // Create new driver document
        const newDriver = new Driver({
            user_id: userId,
        });
        await newDriver.save({ session });
        await session.commitTransaction();
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        throw AppError("There was an issue processing the request. The transaction has been rolled back", 500);
    } finally {
        // End the session
        session.endSession();
    }
}

export async function getUsersByRoleService(
    page: number = 1,
    limit: number = 10,
    sortRole: "driver" | "user" = "user"
) {
    const skip = (page - 1) * limit;
    const filter = sortRole === "user"
        ? { role: userRoles.User }
        : { role: userRoles.Driver };
    const users = await User.find(filter)
        .skip(skip)
        .limit(limit);
    const total = await User.countDocuments(filter);
    return {
        data: users,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

export async function getAdminDashboardStatsService() {
    const [totalOrder, totalUser, totalDriver] = await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: userRoles.User }),
        User.countDocuments({ role: userRoles.Driver }),
    ]);
    return {
        totalOrder,
        totalUser,
        totalDriver,
    };
}
