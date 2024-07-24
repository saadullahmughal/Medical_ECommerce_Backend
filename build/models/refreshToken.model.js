"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refreshTokenSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true, unique: true },
}, { timestamps: true });
const RefreshTokens = mongoose_1.default.model("Refresh Token", refreshTokenSchema);
exports.default = RefreshTokens;
