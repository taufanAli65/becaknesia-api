import { Schema, model } from "mongoose";

export interface ITour extends Document {
    route_name: string,
    description: string,
    duration: number,
    distances: number,
    routes: Array<string>,
    prices: number,
    created_at: Date,
    update_at: Date
}

const tourSchema = new Schema({
    route_name: {type: String, required: true},
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    distances: {type: Number, required: true},
    routes: {type: Array, required: true},
    prices: {type: Number, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "update_at"}
});

const Tour = model<ITour>("Tours", tourSchema);

export default Tour;