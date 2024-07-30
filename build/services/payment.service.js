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
exports.processPayment = exports.processPaymentv2 = exports.addToCart = void 0;
const crypto_1 = require("crypto");
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
            invoice = yield stripe.invoices.create({ customer: customerID, description: "Medical E-Commerce" });
        }
        else {
            invoice = yield stripe.invoices.retrieve(invoiceID);
        }
        let itemID;
        for (const item of invoice.lines.data) {
            if (item.description == orderItem.title) {
                itemID = item.id;
                break;
            }
        }
        if (!itemID)
            yield stripe.invoiceItems.create({
                invoice: invoice.id,
                customer: invoice.customer,
                unit_amount: unitPrice * 100,
                quantity: orderItem.count,
                description: orderItem.title
            });
        else
            yield stripe.invoiceItems.update(itemID, { quantity: orderItem.count });
        invoice = yield stripe.invoices.retrieve(invoice.id);
        return { done: true, message: invoice.id };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.addToCart = addToCart;
const processPaymentv2 = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceID, paymentMethodID } = orderData;
        const customerID = (yield stripe.invoices.retrieve(invoiceID)).customer;
        yield stripe.paymentMethods.attach(paymentMethodID, { customer: customerID });
        //await stripe.invoices.update(invoiceID, { default_payment_method: paymentMethodID })
        const result = yield stripe.invoices.pay(invoiceID, { payment_method: paymentMethodID });
        stripe.invoices.update(invoiceID, {});
        //const result = await stripe.invoices.sendInvoice(invoiceID)
        return { done: true, message: result.receipt_number };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.processPaymentv2 = processPaymentv2;
const processPayment = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionID = (0, crypto_1.randomBytes)(64).toString("base64");
    orderData["transactionID"] = transactionID;
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
        // const cardToken = await stripe.paymentMethods.retrieve(orderData.paymentToken)
        // const paymentMethod = (await stripe.paymentMethods.retrieve(orderData.paymentToken)).card
        // const paymentIntent = await stripe.paymentIntents.create({ amount: orderData?.grandTotal * 100, currency: "pkr", payment_method: orderData.paymentToken, confirm: true, automatic_payment_methods: { enabled: true, allow_redirects: "never" } })
        // const transaction = await stripe.paymentIntents.confirm(paymentIntent.id)
        // const transaction = paymentIntent
        // orderData["paymentAccountInfo"] = { accountType: paymentMethod?.brand, ID: paymentMethod. }
        // const transactionID = transaction.id
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
