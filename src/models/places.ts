import { Schema, model } from "mongoose";

export interface IPlace extends Document {
    name: string,
    coordinates: string,
    description: string,
    photo_url: string,
    created_at: Date,
    updated_at: Date
}

const placeSchema = new Schema ({
    name: {type: String, required: true},
    coordinates: {type: String, required: true},
    description: {type: String, required: true},
    photo_url: {type: String, required: true}
}, {
    timestamps: {createdAt: "created_at", updatedAt: "update_at"}
});

const Place = model<IPlace>("Places", placeSchema);

export default Place;