"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const formSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    referrer: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    showGender: { type: Boolean },
    location: { type: String },
    diagnosis: { type: Boolean },
    indicators: { type: String },
    subtype: { type: String },
    startTime: { type: Date },
});
const FormData = mongoose_1.default.model("userData", formSchema);
exports.default = FormData;
