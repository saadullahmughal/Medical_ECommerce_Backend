"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartReservationSchema = new mongoose_1.default.Schema({
    userID: String,
    reservedItems: [{
            itemTitle: String,
            reservedCount: BigInt,
            _id: false
        }]
}, { timestamps: true, expireAfterSeconds: 50 });
