"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizePaymentReq = exports.addCartReq = exports.getCartReq = exports.createIntentReq = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createIntentReq = joi_1.default.object({
    body: {
        orderItems: joi_1.default.array().required().min(1).items(joi_1.default.object({
            productTitle: joi_1.default.string().required(),
            productCount: joi_1.default.number().integer().min(1).required(),
            unitCost: joi_1.default.number().integer().required().min(1)
        }))
    }
});
exports.getCartReq = joi_1.default.object({
    query: joi_1.default.object({
        cartID: joi_1.default.string().required()
    }).max(1)
});
exports.addCartReq = joi_1.default.object({
    body: {
        item: joi_1.default.string().required(),
        count: joi_1.default.number().integer().required(),
        cartID: joi_1.default.string()
    }
});
exports.finalizePaymentReq = joi_1.default.object({
    body: {
        capture: joi_1.default.boolean().required(),
        clientSecret: joi_1.default.string().required()
        // .regex(new RegExp("^(?:pi_)[^_]+$"))
    }
});
