import { randomInt } from "crypto";
import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
    token: {
        type: BigInt,
        required: true,
        default: randomInt(1000, 10000)
    },
    userID: {
        type: String,
        required: true
    }
}, { timestamps: true })

resetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const resetToken = mongoose.model("resetToken", resetTokenSchema)

export default resetToken