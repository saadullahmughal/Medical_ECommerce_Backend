"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProfilePicReq = exports.changePasswordOrEmailReqBody = exports.updateUserReqBody = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateUserReqBody = joi_1.default.object({
    body: joi_1.default.object({
        password: joi_1.default.string(),
        email: joi_1.default.forbidden(),
        userName: joi_1.default.forbidden(),
        nic: joi_1.default.string(),
        mobile: joi_1.default.string(),
        gender: joi_1.default.string().valid("Male", "Female", "Other"),
        image: joi_1.default.forbidden()
    }).min(1)
});
exports.changePasswordOrEmailReqBody = joi_1.default.object({
    body: joi_1.default.alternatives().try(joi_1.default.object({
        newEmail: joi_1.default.string().required().email()
    }), joi_1.default.object({
        oldPassword: joi_1.default.string().required(),
        newPassword: joi_1.default.string().required()
    }))
});
exports.addProfilePicReq = joi_1.default.object({
    files: {
        image: joi_1.default.required()
    }
});
