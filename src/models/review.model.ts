import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    productTitle: { type: String, required: true },
    rating: { type: Number, default: 0, required: true, min: 0, max: 5 },
    reviewText: { type: String, trim: true },
    reviewTime: { type: Date, required: true, default: Date.now() },
})

const Review = mongoose.model("productReview", reviewSchema)

export default Review
