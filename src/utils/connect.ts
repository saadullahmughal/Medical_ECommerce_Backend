import mongoose from "mongoose"

const uri = process.env?.MONGO_URI as string

export const connectMongoose = async () => {
    try {
        await mongoose.connect(uri)
        return true
    } catch (error) {
        return false
    }
}