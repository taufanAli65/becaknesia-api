require("dotenv").config();

import express from "express";
import connectDatabase from "./config/connection";
import cors from "cors";

import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin"
import tourRoutes from "./routes/tour";
import driverRoutes from "./routes/driver";
import placeRoutes from "./routes/place";
import driverReviewRoutes from "./routes/driverReview";
import tourReviewRoutes from "./routes/tourReview";
import orderRoutes from "./routes/order";
import scheduleRoutes from "./routes/schedule";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()) // Allow all connection

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/tour", tourRoutes);
app.use("/driver", driverRoutes);
app.use("/place", placeRoutes);
app.use("/review/driver", driverReviewRoutes);
app.use("/review/tour", tourReviewRoutes);
app.use("/order", orderRoutes);
app.use("/schedule", scheduleRoutes);

connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    });
    console.log("Successfully connected to database")
}).catch((error) => {
    console.error("Failed to connect to database. Server not started");
    console.error(error);
    process.exit(1);
})

import serverless from "serverless-http";
module.exports = serverless(app);