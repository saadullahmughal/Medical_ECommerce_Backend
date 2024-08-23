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
exports.cancelPayment = exports.capturePayment = exports.getIntentClientSecret = exports.placeOrder = exports.getCart = exports.addToCart = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../models/product.model"));
const stripe_1 = __importDefault(require("stripe"));
const errorParser_1 = require("../utils/errorParser");
const mongodb_1 = require("mongodb");
const stripe = new stripe_1.default((_a = process.env) === null || _a === void 0 ? void 0 : _a.STRIPE_SECRET_KEY);
const addToCart = (itemData, userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let overflow = false;
        const findResult = yield product_model_1.default.findOne({ title: itemData.item }, { price: true, quantity: true });
        if (!findResult)
            throw new Error("Invalid item");
        const price = findResult === null || findResult === void 0 ? void 0 : findResult.price;
        if (!itemData.cartID) {
            if (findResult.quantity < itemData.count) {
                overflow = true;
                itemData.count = findResult.quantity;
            }
            const intent = yield stripe.paymentIntents.create({
                amount: itemData.count * price * 100,
                currency: "usd",
                capture_method: "manual",
            });
            const addedResults = yield order_model_1.default.create({
                transactionID: intent.id, orderItems: [{
                        productTitle: itemData.item,
                        productCount: itemData.count,
                        unitCost: price,
                    }],
                grandTotal: itemData.count * price,
                netTotal: itemData.count * price,
                userName: userName,
            });
            return {
                done: true,
                message: { cartID: itemData.cartID, overflow: overflow }
            };
        }
        else {
            const fetchedData = yield order_model_1.default.findById(itemData.cartID);
            if (!fetchedData)
                throw new Error("Invalid Cart ID");
            if (fetchedData.status == "succeeded")
                throw new Error("Invalid Cart ID");
            const matchedItemsInCart = fetchedData.orderItems.filter((item) => {
                if (item.productTitle == itemData.item)
                    return item;
            });
            if (matchedItemsInCart.length == 0) {
                if (findResult.quantity < itemData.count) {
                    overflow = true;
                    itemData.count = findResult.quantity;
                }
                yield order_model_1.default.findByIdAndUpdate(itemData.cartID, {
                    $push: {
                        orderItems: {
                            productTitle: itemData.item,
                            productCount: itemData.count,
                            unitCost: price,
                        }
                    }
                });
            }
            else {
                if (findResult.quantity < itemData.count + matchedItemsInCart[0].productCount) {
                    overflow = true;
                    itemData.count = findResult.quantity - matchedItemsInCart[0].productCount;
                }
                yield order_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(itemData.cartID), "orderItems.productTitle": itemData.item }, { $inc: { "orderItems.$.productCount": itemData.count } });
            }
            const result = yield order_model_1.default.findByIdAndUpdate(itemData.cartID, { $inc: { grandTotal: price * itemData.count, netTotal: price * itemData.count, } });
            if (!result)
                throw new Error("Couldn't update");
            yield stripe.paymentIntents.update(fetchedData.transactionID, { amount: (result === null || result === void 0 ? void 0 : result.netTotal) * 100 });
            return { done: true, message: { cartID: itemData.cartID, overflow: overflow } };
        }
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.addToCart = addToCart;
const getCart = (cartID, userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield order_model_1.default.findOne({ _id: new mongodb_1.ObjectId(cartID), userName: userName });
        if (!cart)
            throw new Error("Invalid cart ID");
        let results = [];
        for (const index in cart.orderItems) {
            const itemData = cart.orderItems[index];
            const fetchedData = yield product_model_1.default.findOne({ title: itemData.productTitle });
            if (!fetchedData)
                throw new Error("Product Catalog changed. Reload the page");
            else {
                results.push({ item: itemData.productTitle, count: itemData.productCount, stock: fetchedData.quantity, defaultImage: fetchedData.images[fetchedData.defaultImage] || null, price: fetchedData.price });
            }
        }
        return { done: true, message: results };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.getCart = getCart;
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
const getIntentClientSecret = (cartID, userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield order_model_1.default.findOne({ _id: new mongodb_1.ObjectId(cartID), userName: userName }, { transactionID: true });
        if (!cart)
            throw new Error("Invalid cart ID");
        const intent = yield stripe.paymentIntents.retrieve(cart.transactionID);
        return { done: true, message: intent.client_secret };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.getIntentClientSecret = getIntentClientSecret;
const capturePayment = (intentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const intent = yield stripe.paymentIntents.retrieve(intentID);
        yield stripe.paymentIntents.capture(intentID);
        const result = yield order_model_1.default.findOneAndUpdate({ transactionID: intentID }, { status: "succeeded" });
        if (!result)
            throw new Error("Invalid transaction");
        for (const item of result === null || result === void 0 ? void 0 : result.orderItems) {
            const result = yield product_model_1.default.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } });
            if (result.modifiedCount == 0) {
                throw new Error("Possibly bad request. Insufficient inventory items");
            }
        }
        //if (result.matchedCount == 0) throw new Error("Invalid transaction")
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
