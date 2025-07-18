import { Schema, model } from "mongoose";

export enum userRoles {
    User = "user",
    Admin = "admin",
    Driver = "driver"
}

export enum userStatus {
    Aktif = "aktif", // if the user already verified via email
    Nonaktif = "nonaktif"
}

export interface IUser extends Document {
    name: string,
    password: string,
    email: string,
    no_hp: string,
    role: userRoles,
    status: userStatus,
    photoUrl: string,
    created_at: Date,
    update_at: Date,
    verificationToken?: string,
    verificationTokenExpires?: Date
}

const userSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email is invalid'],
    },
    no_hp: {type: String, required: true},
    role: {
        type: String,
        enum: Object.values(userRoles),
        required: true,
        default: userRoles.User,
    },
    status: {
        type: String,
        enum: Object.values(userStatus),
        required: true,
        default: userStatus.Nonaktif, // User need to verify the email in order to be activated
    },
    photoUrl: {type: String, required: true},
    verificationToken: {type: String},
    verificationTokenExpires: {type: Date}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "update_at"}
});

const User = model<IUser>("Users", userSchema);

export default User;