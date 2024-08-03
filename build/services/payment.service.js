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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPayment = exports.capturePayment = exports.placeOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../models/product.model"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default((_a = process.env) === null || _a === void 0 ? void 0 : _a.STRIPE_SECRET_KEY);
const placeOrder = (orderData, userName) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        {
            const orderItems = orderData === null || orderData === void 0 ? void 0 : orderData.orderItems;
            let sum = 0;
            for (const item of orderItems) {
                sum += (item === null || item === void 0 ? void 0 : item.productCount) * (item === null || item === void 0 ? void 0 : item.unitCost);
                const result = yield product_model_1.default.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } }, { session });
                if (result.modifiedCount == 0) {
                    throw new Error("Possibly bad request. Insufficient inventory items");
                }
            }
            const intent = yield stripe.paymentIntents.create({
                amount: sum * 100,
                currency: "usd",
                capture_method: "manual",
            });
            const result2 = yield order_model_1.default.create([{
                    transactionID: intent.id,
                    userName: userName,
                    orderItems: orderData === null || orderData === void 0 ? void 0 : orderData.orderItems,
                    grandTotal: sum,
                    netTotal: sum
                }], { session });
            yield session.commitTransaction();
            yield session.endSession();
            return { done: true, message: intent.client_secret };
        }
    }
    catch (error) {
        console.error(error);
        yield session.abortTransaction();
        yield session.endSession();
        return { done: false, message: error.message };
    }
});
exports.placeOrder = placeOrder;
const capturePayment = (intentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const intent = yield stripe.paymentIntents.retrieve(intentID);
        yield stripe.paymentIntents.capture(intentID);
        const result = yield order_model_1.default.updateOne({ transactionID: intentID }, { status: "succeeded" });
        if (result.matchedCount == 0)
            throw new Error("Invalid transaction");
        return { done: true, message: `${intentID} captured` };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: error.message };
    }
});
exports.capturePayment = capturePayment;
const cancelPayment = (intentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const intent = yield stripe.paymentIntents.retrieve(intentID);
        yield stripe.paymentIntents.cancel(intentID);
        const order = yield order_model_1.default.findOneAndUpdate({ transactionID: intentID }, { status: "cancelled" });
        for (const item of order === null || order === void 0 ? void 0 : order.orderItems) {
            const result = yield product_model_1.default.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: item.productCount } });
            if (result.modifiedCount == 0) {
                throw new Error("Something went wrong");
            }
        }
        return { done: true, message: `${intentID} cancelled` };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: error.message };
    }
});
exports.cancelPayment = cancelPayment;
