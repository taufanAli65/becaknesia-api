import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL as string;

export default function connectDatabase(): Promise<typeof mongoose> {
    return mongoose.connect(MONGODB_URL);
}