import User, {userRoles} from "../models/users";
import { sendEmail } from "../helpers/sendEmail";
import generateVerificationToken from "../helpers/generateVerificationToken";


async function register(name: string, password: string, email: string, no_hp: string, roles: userRoles, photoUrl: string) {
    const user = new User({
        name,
        password,
        email,
        no_hp,
        roles,
        photoUrl
    })
    await user.save();

    // Generate verification token
    const verificationToken = generateVerificationToken(user);
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
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


export {register};