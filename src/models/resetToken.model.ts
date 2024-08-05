import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
    token: {
        type: BigInt,
        required: true,
        unique: true,
        default: Date.now()
    },
    userID: {
        type: String,
        required: true,
        unique: true
    }
}, { expireAfterSeconds: 900 })

const resetToken = mongoose.model("resetToken", resetTokenSchema)

export default resetToken