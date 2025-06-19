import User, { userStatus } from "../models/users";

export default async function verifyUser(token: string) {
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: new Date() }
    });
    if (!user) {
        throw new Error("Token tidak valid atau sudah kedaluwarsa");
    }
    user.status = userStatus.Aktif;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return user;
}