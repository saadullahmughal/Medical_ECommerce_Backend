"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenReqBody = exports.resetPasswordReqBody = exports.forgotPasswordReqBody = exports.logOutReqBody = exports.logInReqBody = exports.signUpReqBody = exports.addUserReqBody = exports.AuthToken = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AuthToken = joi_1.default.compile(joi_1.default.object({
    userName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string().required()
}));
exports.addUserReqBody = joi_1.default.object({
    body: {
        role: joi_1.default.string().required().lowercase().valid("admin", "user"),
        email: joi_1.default.string().required().email(),
        userName: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    }
});
exports.signUpReqBody = joi_1.default.object({
    body: {
        role: joi_1.default.forbidden(),
        email: joi_1.default.string().required().email(),
        userName: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    }
});
exports.logInReqBody = joi_1.default.object({
    body: joi_1.default.object({
        userName: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    }).max(2)
});
exports.logOutReqBody = joi_1.default.object({
    body: joi_1.default.object({
        token: joi_1.default.string().required()
    }).max(1)
});
exports.forgotPasswordReqBody = joi_1.default.object({
    body: joi_1.default.object({
        userName: joi_1.default.string().required()
    }).max(1)
});
exports.resetPasswordReqBody = joi_1.default.object({
    body: joi_1.default.object({
        userName: joi_1.default.string().required(),
        token: joi_1.default.number().integer().required(),
        password: joi_1.default.string().required(),
    }).max(3)
});
exports.refreshTokenReqBody = joi_1.default.object({
    body: {
        token: joi_1.default.string().required()
    }
});
