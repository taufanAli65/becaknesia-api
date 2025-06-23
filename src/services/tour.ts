import Tour from "../models/tours";

async function createNewTourPackageService(route_name: String, description: String, duration: Number, distances: Number, routes: Array<string>, prices: Number): Promise<void> {
    const tour = new Tour({
        route_name,
        description,
        duration,
        distances,
        routes,
        prices
    })
    await tour.save();
}

export {createNewTourPackageService}