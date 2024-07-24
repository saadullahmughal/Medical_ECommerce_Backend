"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delProductReq = exports.addStockReq = exports.updateProductReq = exports.addProductReq = exports.addReviewReq = exports.getFilteredProductsReq = void 0;
const joi_1 = __importDefault(require("joi"));
exports.getFilteredProductsReq = joi_1.default.object({
    query: {
        maxNumber: joi_1.default.number().integer().min(1)
    },
    body: joi_1.default.object({
        searchText: joi_1.default.string(),
        onSales: joi_1.default.boolean(),
        type: joi_1.default.string(),
        newArrivals: joi_1.default.boolean(),
        minPrice: joi_1.default.number().integer().min(0),
        maxPrice: joi_1.default.number().integer().min(0),
        dietNeeds: joi_1.default.array().items(joi_1.default.string()).min(1),
        allergenFilters: joi_1.default.array().items(joi_1.default.string()).min(1),
    }).min(1)
});
exports.addReviewReq = joi_1.default.object({
    body: {
        productTitle: joi_1.default.string().required(),
        rating: joi_1.default.number().integer().min(0).max(5).required(),
        reviewText: joi_1.default.string()
    }
});
exports.addProductReq = joi_1.default.object({
    body: {
        title: joi_1.default.string().required(),
        description: joi_1.default.string(),
        price: joi_1.default.number().integer().min(0).required(),
        productType: joi_1.default.string(),
        deliveryTime: joi_1.default.string(),
        quantity: joi_1.default.number().integer().min(0).required(),
        images: joi_1.default.array().items(joi_1.default.string()).required(),
        defaultImage: joi_1.default.number().integer().min(0),
        ingredients: joi_1.default.array().items(joi_1.default.string()),
        amountsPerServing: joi_1.default.array().items(joi_1.default.object({
            item: joi_1.default.string().required(),
            value: joi_1.default.string().required(),
            valuePercent: joi_1.default.number().min(0).max(100)
        })),
        alertMsg: joi_1.default.string(),
    }
});
exports.updateProductReq = joi_1.default.object({
    body: joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string(),
        price: joi_1.default.number().integer().min(0),
        productType: joi_1.default.string(),
        deliveryTime: joi_1.default.string(),
        quantity: joi_1.default.number().integer().min(0),
        images: joi_1.default.array().items(joi_1.default.string()),
        defaultImage: joi_1.default.number().integer().min(0),
        ingredients: joi_1.default.array().items(joi_1.default.string()),
        amountsPerServing: joi_1.default.array().items(joi_1.default.object({
            item: joi_1.default.string().required(),
            value: joi_1.default.string().required(),
            valuePercent: joi_1.default.number().min(0).max(100)
        })),
        alertMsg: joi_1.default.string(),
    }).min(2)
});
exports.addStockReq = joi_1.default.object({
    body: {
        title: joi_1.default.string().required(),
        quantity: joi_1.default.number().integer().min(1).required()
    }
});
exports.delProductReq = joi_1.default.object({
    query: {
        productName: joi_1.default.string().required()
    }
});
