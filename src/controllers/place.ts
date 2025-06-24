import {createPlaceService, getPlacesService, getPlaceService, updatePlaceService, deletePlaceService} from "../services/place";
import { Request, Response, NextFunction } from "express";
import { sendSuccess, sendFail } from "../utils/senResponse";
import { validate } from "../utils/validate";
import { createPlaceSchema, needPlaceIDSchema, updatePlaceSchema } from "../validators/place";
import { uploadPhoto } from "../helpers/supabaseUpload";

export const createPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let photo_url = "";
    if (req.file) {
        photo_url = await uploadPhoto("place", req.file);
    } else {
        return sendFail(res, 400, "Photo is required");
    }
    // Validate the rest of the fields except photo_url
    const { name, coordinates, description, } = validate(
        createPlaceSchema.omit({ photo_url: true }),
        req.body
    );
    await createPlaceService(name, coordinates, description, photo_url);
    return sendSuccess(res, 201, "Place created successfully");
  } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
  }
};

export const getPlaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const result = await getPlacesService(page, limit, search);
    return sendSuccess(res, 200, "Places fetched successfully", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};


export const getPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { place_id } = validate(needPlaceIDSchema, req.params);
    const place = await getPlaceService(place_id);
    return sendSuccess(res, 200, `Place with ID: ${place_id} is fetched successfully`, place);
  } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
  }
};

export const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { place_id } = validate(needPlaceIDSchema, req.params);

    let photo_url: string | undefined = undefined;
    if (req.file) {
      photo_url = await uploadPhoto("place", req.file);
    }
    const { name, coordinates, description } = validate(
      updatePlaceSchema.omit({ photo_url: true }),
      req.body
    );
    const updated = await updatePlaceService(
      place_id,
      name,
      coordinates,
      description,
      photo_url
    );
    return sendSuccess(res, 200, "Place updated successfully", updated);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return sendFail(res, 400, errorMessage, error);
  }
};

export const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { place_id } = validate(needPlaceIDSchema, req.params);

    await deletePlaceService(place_id);
    return sendSuccess(res, 200, "Place deleted successfully");
  } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return sendFail(res, 400, errorMessage, error);
  }
}
