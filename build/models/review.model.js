"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    userName: { type: String, required: true },
    productTitle: { type: String, required: true },
    rating: { type: Number, default: 0, required: true, min: 0, max: 5 },
    reviewText: { type: String, trim: true },
    reviewTime: { type: Date, required: true, default: Date.now() },
});
const Review = mongoose_1.default.model("productReview", reviewSchema);
exports.default = Review;
