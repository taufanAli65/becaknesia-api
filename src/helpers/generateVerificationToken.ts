import crypto from "crypto"; 

export default function generateVerificationToken(user: any) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    return verificationToken;
}