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
exports.processPayment = exports.addToCart = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../models/product.model"));
const errorParser_1 = require("../utils/errorParser");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default((_a = process.env) === null || _a === void 0 ? void 0 : _a.STRIPE_SECRET_KEY);
const addToCart = (orderItem, invoiceID) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let customerID = "cus_QZKFdvOiQxi2Zw";
        const unitPrice = (_a = (yield product_model_1.default.findOne({ title: orderItem.title }, { price: 1 }))) === null || _a === void 0 ? void 0 : _a.price;
        if (!unitPrice)
            throw new Error("No such item exists");
        const cost = unitPrice * orderItem.count;
        let invoice;
        if (!invoiceID) {
            invoice = yield stripe.invoices.create({ customer: customerID });
        }
        else {
            invoice = yield stripe.invoices.retrieve(invoiceID);
        }
        yield stripe.invoiceItems.create({
            invoice: invoice.id,
            customer: invoice.customer,
            unit_amount: unitPrice,
            quantity: orderItem.count,
            description: orderItem.title
        });
        return { done: true, message: invoice.id };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.addToCart = addToCart;
const processPayment = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    //   const transactionID = randomBytes(64).toString("base64")
    //   orderData["transactionID"] = transactionID
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const orderItems = orderData === null || orderData === void 0 ? void 0 : orderData.orderItems;
        let sum = 0;
        for (const item of orderItems) {
            sum += (item === null || item === void 0 ? void 0 : item.productCount) * (item === null || item === void 0 ? void 0 : item.unitCost);
            const result = yield product_model_1.default.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } }, { session });
            if (result.modifiedCount == 0) {
                yield session.abortTransaction();
                yield session.endSession();
                return { done: false, message: "Possibly bad request" };
            }
        }
        //const cardToken = await stripe.paymentMethods.retrieve(orderData.paymentToken)
        const paymentMethod = (yield stripe.paymentMethods.retrieve(orderData.paymentToken)).card;
        const paymentIntent = yield stripe.paymentIntents.create({ amount: (orderData === null || orderData === void 0 ? void 0 : orderData.grandTotal) * 100, currency: "pkr", payment_method: orderData.paymentToken, confirm: true, automatic_payment_methods: { enabled: true, allow_redirects: "never" } });
        //const transaction = await stripe.paymentIntents.confirm(paymentIntent.id)
        const transaction = paymentIntent;
        //orderData["paymentAccountInfo"] = { accountType: paymentMethod?.brand, ID: paymentMethod. }
        const transactionID = transaction.id;
        orderData["transactionID"] = transactionID;
        const response = yield order_model_1.default.create([orderData], { session });
        if (!response) {
            throw new Error("Order not created");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return { done: true, message: transactionID };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        console.log(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.processPayment = processPayment;
