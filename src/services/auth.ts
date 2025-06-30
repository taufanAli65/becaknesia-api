import User, {userRoles, userStatus} from "../models/users";
import { sendEmail } from "../helpers/sendEmail";
import generateVerificationToken from "../helpers/generateVerificationToken";
import { hashPassword } from "../helpers/hashPassword";
import { AppError } from "../utils/appError";
import comparePassword from "../helpers/comparePassword";
import jwt from "jsonwebtoken";


async function registerService(name: string, password: string, email: string, no_hp: string, photoUrl?: string): Promise<void> {
    const userExists = await User.findOne({ email });
    if (userExists) throw AppError("Email already registered", 400);
    const hashedPassword = await hashPassword(password);
    const role = userRoles.User;
    const user = new User({
        name,
        password: hashedPassword,
        email,
        no_hp,
        role,
        photoUrl
    })
    await user.save();

    // Generate verification token
    const verificationToken = generateVerificationToken(user);
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.VERIFICATION_URL}/auth/activate?token=${verificationToken}`;
    await sendEmail({
        to: user.email,
        subject: "Verifikasi Email Anda",
        templateName: "verify_user",
        context: {
            name: user.name,
            verification_url: verificationUrl
        }
    });
}

async function activateUserService(token: string): Promise<void> {
    const user = await User.findOne({ verificationToken: token});
    if (!user) {
        throw AppError("Invalid or expired verification token", 400);
    }
    user.status = userStatus.Aktif;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
}

async function resendVerificationEmailService(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
        throw AppError("User not found", 404);
    }
    if (user.status === userStatus.Aktif) {
        throw AppError("User already activated", 400);
    }
    // Generate new verification token
    const verificationToken = generateVerificationToken(user);
    user.save();
    // Send verification email
    const verificationUrl = `${process.env.VERIFICATION_URL}/auth/activate?token=${verificationToken}`;
    await sendEmail({
        to: user.email,
        subject: "Verifikasi Email Anda",
        templateName: "verify_user",
        context: {
            name: user.name,
            verification_url: verificationUrl
        }
    });
}

async function loginService(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });
    if(!user) throw AppError("Invalid email or password", 401);
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw AppError("Invalid password", 401);
    }
    if (user.status !== userStatus.Aktif) {
        throw AppError("User not activated. Please verify your email.", 403);
    }
    const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
    return token;
}

async function updateUserService(userId: string, updateData: Partial<{ name: string; email: string; no_hp: string; photoUrl: string }>): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
        throw AppError("User not found", 404);
    }
    if (updateData.email && updateData.email !== user.email) {
        const emailExists = await User.findOne({ email: updateData.email });
        if (emailExists) {
            throw AppError("Email already in use", 400);
        }
        user.email = updateData.email;
        user.status = userStatus.Nonaktif;

        const verificationToken = generateVerificationToken(user);
        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.VERIFICATION_URL}/auth/activate?token=${verificationToken}`;
        await sendEmail({
        to: user.email,
        subject: "Verifikasi Email Anda",
        templateName: "verify_user",
        context: {
            name: user.name,
            verification_url: verificationUrl
        }
        });
    }
    if (updateData.name) user.name = updateData.name;
    if (updateData.no_hp) user.no_hp = updateData.no_hp;
    if (updateData.photoUrl) user.photoUrl = updateData.photoUrl;
    await user.save();
}

export {registerService, activateUserService, resendVerificationEmailService, loginService, updateUserService};