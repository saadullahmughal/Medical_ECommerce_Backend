"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resetTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: BigInt,
        required: true,
        unique: true,
        default: Date.now()
    },
    userID: {
        type: String,
        required: true,
        unique: true
    }
}, { expireAfterSeconds: 900 });
const resetToken = mongoose_1.default.model("resetToken", resetTokenSchema);
exports.default = resetToken;
