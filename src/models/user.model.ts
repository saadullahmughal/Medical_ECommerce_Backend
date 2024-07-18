import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ["admin", "user"], default: "user" },
        dateOfBirth: { type: Date },
        mobile: { type: String },
        nic: { type: String },
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        image: { type: String }
    },
    { timestamps: true }
)

const User = mongoose.model("user", userSchema)

export default User
