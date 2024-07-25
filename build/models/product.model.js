"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const testSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb+srv://saadullah:saad2003@devminified.hiye9xh.mongodb.net/medicalECommerce?retryWrites=true&w=majority&appName=Devminified");
    console.log("Connected");
    yield Product.create({
        title: "Organic Carrots",
        price: 50,
        quantity: 10,
        images: [null],
        defaultImage: 0,
        productType: "Vegetables",
        amountsPerServing: [
            { item: "Calories", value: "40" },
            { item: "Total Fat", value: "10g", valuePercent: 12 },
            { item: "Sodium", value: "5mg", valuePercent: 37 },
            { item: "Protein", value: "2g", valuePercent: 55 },
            { item: "Iron", value: "1.7mg", valuePercent: 23 },
        ],
        tags: ["Vegtables", "Low Fat", "Organic"],
        servingSize: "1/2 cup (120g)",
        servingsPerContainer: 3.5,
        alertMsg: "Excess amount can cause overloading of vitamin A",
    });
    console.log("Success");
});
//testSchema()
exports.default = Product;
