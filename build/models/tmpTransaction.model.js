"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tmpTransactionSchema = new mongoose_1.default.Schema({
    payment_intent: String,
    userID: String,
    reservedItems: [{
            itemTitle: String,
            reservedCount: Number,
            _id: false
        }]
}, { expireAfterSeconds: 3600 });
const tmpTransaction = mongoose_1.default.model("reserved", tmpTransactionSchema);
exports.default = tmpTransaction;
