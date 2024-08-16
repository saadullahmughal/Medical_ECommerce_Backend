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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductData = exports.addReview = exports.getProducts = exports.getProductData = exports.incrementStock = exports.updateProductData = exports.addProductData = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const date_fns_1 = require("date-fns");
const order_model_1 = __importDefault(require("../models/order.model"));
const errorParser_1 = require("../utils/errorParser");
const user_model_1 = __importDefault(require("../models/user.model"));
const addProductData = (productInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.default.create(productInfo);
        return { done: true };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.addProductData = addProductData;
const updateProductData = (productTitle, newProductInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.default.updateOne({ title: productTitle }, { $set: newProductInfo });
        if (result.matchedCount == 0)
            return { done: false, message: "No such product exists" };
        else
            return { done: true };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.updateProductData = updateProductData;
const incrementStock = (productTitle, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.default.updateOne({ title: productTitle }, { $inc: { quantity: quantity } });
        if ((result === null || result === void 0 ? void 0 : result.matchedCount) == 0)
            return { done: false, message: "No such product exists" };
        else {
            done: true;
        }
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.incrementStock = incrementStock;
const getProductData = (productTitle) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.default.findOne({ title: productTitle })
            .select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
            .exec();
        if (!product)
            return { done: false, message: "No such product exists" };
        const queryResults = yield review_model_1.default.find({ productTitle: productTitle })
            .limit(2)
            .select({ _id: 0, productTitle: 0 })
            .exec();
        const orderCount = yield order_model_1.default.countDocuments({
            "orderItems.productTitle": productTitle,
        });
        const ratingStats = [
            yield review_model_1.default.countDocuments({ productTitle: productTitle, rating: 0 }),
            yield review_model_1.default.countDocuments({ productTitle: productTitle, rating: 1 }),
            yield review_model_1.default.countDocuments({ productTitle: productTitle, rating: 2 }),
            yield review_model_1.default.countDocuments({ productTitle: productTitle, rating: 3 }),
            yield review_model_1.default.countDocuments({ productTitle: productTitle, rating: 4 }),
            yield review_model_1.default.countDocuments({ productTitle: productTitle, rating: 5 }),
        ];
        const reviewCount = ratingStats.reduce((total, element, index) => total + element, 0);
        const totalStars = ratingStats.reduce((total, element, index) => total + element * index, 0);
        const avgRating = reviewCount != 0 ? totalStars / reviewCount : 0;
        let images = [];
        for (const key in queryResults) {
            const doc = queryResults[key];
            const userInfo = yield user_model_1.default.findOne({ userName: doc.userName }, { image: true });
            images.push((userInfo === null || userInfo === void 0 ? void 0 : userInfo.image) || "");
        }
        const reviews = queryResults.map((element, index) => {
            let result = {};
            for (const [key, value] of Object.entries(element.toObject())) {
                if (key != "reviewTime")
                    result[key] = value;
                else
                    result["reviewDate"] = (0, date_fns_1.format)(element.reviewTime, "dd MMMM yyyy");
            }
            return Object.assign(Object.assign({}, result), { userImage: images[index] });
            //return { ...result, userImage: images[index].then((userInfo) => userInfo?.image) }
        });
        let finalResult = Object.assign(Object.assign({}, product.toObject()), { orderCount: orderCount, reviews: reviews, reviewCount: reviewCount, ratingStats: ratingStats, avgRating: avgRating });
        return { done: true, message: finalResult };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.getProductData = getProductData;
const getProducts = (maxNumber, filters) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchText, type, newArrivals, minPrice, maxPrice, dietNeeds, allergenFilters } = filters;
    let onSales = filters === null || filters === void 0 ? void 0 : filters.onSales;
    if (onSales != false && !onSales)
        onSales = true;
    let filterQuery = { "price": { $gte: 0 } };
    if (type)
        filterQuery['productType'] = { $regex: "^(?:" + type + ")$", $options: "i" };
    if (onSales)
        filterQuery['quantity'] = { $gt: 0 };
    if (newArrivals)
        filterQuery['createdAt'] = { $gte: new Date(Date.now() - 604800000) };
    if (minPrice)
        filterQuery['price']['$gte'] = minPrice;
    if (maxPrice)
        filterQuery['price']['$lte'] = maxPrice;
    if (dietNeeds)
        filterQuery['tags'] = { $all: dietNeeds };
    if (allergenFilters) {
        if (!dietNeeds)
            filterQuery['tags'] = { $all: allergenFilters };
        else {
            const query = [...(_a = filterQuery['tags']) === null || _a === void 0 ? void 0 : _a.$all, ...allergenFilters];
            filterQuery['tags'] = { $all: query };
        }
    }
    console.log(filterQuery);
    if (searchText)
        filterQuery['title'] = { $regex: "\\b(?:" + searchText + ")", $options: "i" };
    console.log(filterQuery);
    try {
        const results = yield product_model_1.default.find(filterQuery).limit(maxNumber).select({ _id: false, title: true, price: true, images: 1, defaultImage: 1, quantity: 1, description: true, shortTitle: true, unit: true }).exec();
        if (!results)
            return { done: true, message: [] };
        const responses = results.map((doc) => {
            const element = doc.toObject();
            const validImgData = element.images.length > element.defaultImage;
            return Object.assign(Object.assign({}, element), { defaultImage: validImgData ? element.images[element.defaultImage] : null });
        });
        return { done: true, message: responses };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.getProducts = getProducts;
const addReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield review_model_1.default.create(reviewData);
        if (!results)
            throw new Error("Unable to create review");
        else
            return { done: true };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.addReview = addReview;
const deleteProductData = (productName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryResults = yield product_model_1.default.deleteOne({ title: productName });
        if (queryResults.deletedCount == 1) {
            return { done: true };
        }
        else {
            return { done: false, message: "No such product exists" };
        }
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.deleteProductData = deleteProductData;
