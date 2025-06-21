import User, {userRoles, userStatus} from "../models/users";
import { sendEmail } from "../helpers/sendEmail";
import generateVerificationToken from "../helpers/generateVerificationToken";
import { hashPassword } from "../helpers/hashPassword";
import { AppError } from "../utils/appError";


async function registerService(name: string, password: string, email: string, no_hp: string, role: userRoles, photoUrl?: string) {
    const hashedPassword = await hashPassword(password);
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

async function activateUserService(token: string) {
    const user = await User.findOne({ verificationToken: token});
    if (!user) {
        throw AppError("Invalid or expired verification token", 400);
    }
    user.status = userStatus.Aktif;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
}

export {registerService, activateUserService};