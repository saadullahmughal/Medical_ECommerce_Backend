import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, unique: true },
    },
    { timestamps: true }
)

const RefreshTokens = mongoose.model("Refresh Token", refreshTokenSchema)

export default RefreshTokens
