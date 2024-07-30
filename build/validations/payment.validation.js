"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaymentReq = void 0;
const joi_1 = __importDefault(require("joi"));
exports.handlePaymentReq = joi_1.default.object({
    body: {
        orderItems: joi_1.default.array().required().min(1).items(joi_1.default.object({
            productTitle: joi_1.default.string().required(),
            productCount: joi_1.default.number().integer().min(1).required(),
            unitCost: joi_1.default.number().integer().required().min(1)
        })),
        grandTotal: joi_1.default.number().integer().positive().required(),
        shippingFee: joi_1.default.number().integer().positive(),
        discounted: joi_1.default.number().integer().positive(),
        convienceFee: joi_1.default.number().integer().positive(),
        // paymentAccountInfo: Joi.object({
        //     accountType: Joi.string().required().valid("Master", "Visa", "Amex", "PayPal"),
        //     ID: Joi.string().required(),
        //     legalName: Joi.string(),
        //     expiry: Joi.string(),
        //     cvv: Joi.number().integer().positive()
        // }),
        paymentToken: joi_1.default.string().required()
    }
});
