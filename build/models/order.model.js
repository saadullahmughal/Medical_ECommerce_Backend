"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    orderItems: {
        type: [{
                _id: false,
                productTitle: { type: String, required: true },
                productCount: { type: Number, min: 1, required: true },
                unitCost: { type: Number, min: 1, required: true },
            }], required: true
    },
    userName: { type: String, required: true },
    convienceFee: { type: Number },
    shippingFee: { type: Number },
    discounted: { type: Number },
    grandTotal: { type: Number, required: true },
    paymentAccountInfo: {
        required: true, type: {
            _id: false,
            accountType: { type: String, required: true, enum: ["Master", "Visa", "Amex", "PayPal"] },
            ID: { type: String, required: true },
            legalName: { tytpe: String },
            expiry: { type: String },
            cvv: { type: Number },
        }
    },
    transactionID: { type: String, required: true }
}, { timestamps: true });
const Order = mongoose_1.default.model("order", orderSchema);
//Order.create({userName: "Saadullah", grandTotal: 5000, orderItems: [{productTitle: "Organic Carrots", productCount: 5, unitCost: 50}], paymentAccountInfo: {accountType: "PayPal", ID: "saadullahmughal4@gmail.com"}, transactionID: "uusd0aud9ad80a9" }).then(() => {console.log("Order Added")}).catch((err) => {console.error(err)})
exports.default = Order;
