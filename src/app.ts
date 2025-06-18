require("dotenv").config();

import express from "express";
import connectDatabase from "./config/connection";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()) // Allow all connection

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