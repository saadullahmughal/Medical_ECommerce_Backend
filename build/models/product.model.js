"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true },
    shorTitle: { type: String },
    unit: { type: String },
    description: { type: String },
    price: { type: Number, min: 1, required: true },
    productType: { type: String },
    deliveryTime: { type: String },
    quantity: { type: Number, min: 0, required: true },
    images: { type: [String], required: true },
    defaultImage: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    ingredients: { type: [String] },
    servingsPerContainer: { type: Number },
    servingSize: { type: String },
    tags: { type: [String] },
    amountsPerServing: {
        type: [{
                item: { type: String, unique: true, required: true },
                value: { type: String, required: true },
                valuePercent: { type: Number },
                _id: false,
            }],
    },
    alertMsg: { type: String },
}, { timestamps: true });
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
