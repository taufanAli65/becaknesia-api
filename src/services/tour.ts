import Tour from "../models/tours";
import { AppError } from "../utils/appError";

async function createNewTourPackageService(route_name: String, description: String, duration: Number, distances: Number, routes: Array<string>, prices: Number, photo_url: string): Promise<void> {
    const tour = new Tour({
        route_name,
        description,
        duration,
        distances,
        routes,
        prices,
        photo_url
    })
    await tour.save();
}

async function getTourPackagesService(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const tours = await Tour.find().skip(skip).limit(limit);
    const total = await Tour.countDocuments();
    return {
        data: tours,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

async function getTourPackageService(tourID:string) {
    if(!tourID) throw AppError("Tour ID is required", 400)
    const tour = await Tour.findById({tourID});
    if(!tour) throw AppError("No tour package with such ID", 404);
    return tour;
}

async function updateTourPackageService(tourID:string, route_name?: String, description?: String, duration?: Number, distances?: Number, routes?: Array<string>, prices?: Number) {
    if(!tourID) throw AppError("Tour ID is required", 400);
    const updateFields: any = {};
    if (route_name !== undefined) updateFields.route_name = route_name;
    if (description !== undefined) updateFields.description = description;
    if (duration !== undefined) updateFields.duration = duration;
    if (distances !== undefined) updateFields.distances = distances;
    if (routes !== undefined) updateFields.routes = routes;
    if (prices !== undefined) updateFields.prices = prices;
    const updatedTour = await Tour.findByIdAndUpdate(
        tourID,
        { $set: updateFields },
        { new: true, runValidators: true }
    );
    if (!updatedTour) {
        throw AppError("Tour not found", 404);
    }
    return updatedTour;
}

async function deleteTourPackageService(tourID: string) {
  if (!tourID) throw AppError("Tour ID is required", 400);
  const deletedTourPackage = await Tour.findByIdAndDelete(tourID);
  if (!deletedTourPackage) {
    throw AppError("Tour not found", 404);
  }
  return deletedTourPackage;
}

export {createNewTourPackageService, getTourPackagesService, getTourPackageService, updateTourPackageService, deleteTourPackageService};