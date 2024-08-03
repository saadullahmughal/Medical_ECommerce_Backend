"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizePaymentReq = exports.createIntentReq = void 0;
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
exports.finalizePaymentReq = joi_1.default.object({
    body: {
        capture: joi_1.default.boolean().required(),
        intent_id: joi_1.default.string().required().regex(new RegExp(""))
    }
});
