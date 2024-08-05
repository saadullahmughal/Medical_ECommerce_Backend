"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const mongoose_1 = __importDefault(require("mongoose"));
const resetTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: BigInt,
        required: true,
        default: (0, crypto_1.randomInt)(1000, 10000)
    },
    userID: {
        type: String,
        required: true
    }
}, { timestamps: true });
resetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });
const resetToken = mongoose_1.default.model("resetToken", resetTokenSchema);
exports.default = resetToken;
