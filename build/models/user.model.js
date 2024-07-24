"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"], default: "user" },
    dateOfBirth: { type: Date },
    mobile: { type: String },
    nic: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    image: { type: String }
}, { timestamps: true });
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
