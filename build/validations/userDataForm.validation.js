"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFormReq = void 0;
const joi_1 = __importDefault(require("joi"));
exports.submitFormReq = joi_1.default.object({
    body: {
        email: joi_1.default.string().email().required(),
        age: joi_1.default.number().integer().positive(),
        referrer: joi_1.default.string(),
        gender: joi_1.default.string().valid("Male", "Female", "Other"),
        showGender: joi_1.default.boolean(),
        location: joi_1.default.string(),
        diagnosis: joi_1.default.boolean(),
        indicators: joi_1.default.string(),
        subType: joi_1.default.string(),
        startTime: joi_1.default.string(),
    }
});
