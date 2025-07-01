import Place from "../models/places";
import { AppError } from "../utils/appError";

async function createPlaceService(name: string, coordinates: string, description: string, photo_url: string, category: string) {
    const place = new Place({name, coordinates, description, photo_url, category});
    await place.save();
}

async function getPlacesService(page: number = 1, limit: number = 10, search?: string) {
  const skip = (page - 1) * limit;
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } }, // case-insensitive
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const places = await Place.find(query).skip(skip).limit(limit);
  const total = await Place.countDocuments(query);

  return {
    data: places,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}


async function getPlaceService(placeID: string) {
    if(!placeID) throw AppError("Place ID is required", 400);
    const place = await Place.findById(placeID);
    if(!place) throw AppError("There is no place with such ID", 400);
    return place;
}

async function updatePlaceService(placeID: string, name?: string, coordinates?: string, description?: string, photo_url?: string, category?: string) {
  if (!placeID) throw AppError("Place ID is required", 400);
  const updateFields: any = {};
  if (name !== undefined) updateFields.name = name;
  if (coordinates !== undefined) updateFields.coordinates = coordinates;
  if (description !== undefined) updateFields.description = description;
  if (photo_url !== undefined) updateFields.photo_url = photo_url;
  if (category !== undefined) updateFields.category = category;
  if (Object.keys(updateFields).length === 0) {
    throw AppError("No update data provided", 400);
  }
  const updatedPlace = await Place.findByIdAndUpdate(
    placeID,
    { $set: updateFields },
    { new: true, runValidators: true }
  );
  if (!updatedPlace) {
    throw AppError("Place not found", 404);
  }
  return updatedPlace;
}

async function deletePlaceService(placeID: string) {
    if(!placeID) throw AppError("Place ID is required", 400);
    await Place.findByIdAndDelete(placeID)
}

export {createPlaceService, getPlacesService, getPlaceService, updatePlaceService, deletePlaceService}