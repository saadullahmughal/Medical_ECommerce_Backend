import mongoose from "mongoose";
import app from "./server";
import { verifyConnection } from "./services/email.service";
require("dotenv").config();

const uri = process.env.MONGO_URI as string;
const PORT = process.env.PORT || 5000

async function start() {
    try {
        console.log("Connecting to MongoDB")
        await mongoose.connect(uri)
        console.log("Successfully connected to MongoDB")
        console.log("Connecting to Gmail")
        const connected = await verifyConnection()
        if (!connected) throw new Error("Couldn't connect to Gmail")
        console.log("Successfully connected to Gmail")
        app.listen(PORT, () => {
            console.log("Server is running")
        })
    } catch (error) {
        console.error(error)
        console.error("ERROR: Unable to connect to MongoDB or Gmail")
    }
}

start();
// mongoose.connect(uri).then(() => {
//     console.log("Connected");
//     getProductData("Organic Carrots");
// });
