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
exports.changePasswordOrEmail = exports.refreshToken = exports.resetPassword = exports.forgotPassword = exports.logOut = exports.logIn = exports.signUp = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("../services/auth.service");
const auth_1 = require("../middlewares/auth");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, auth_service_1.signUpService)(req.body);
    if (response.done) {
        res.status(http_status_1.default.CREATED).send(response);
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.signUp = signUp;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, auth_service_1.logInService)(req.body);
    if (response === null || response === void 0 ? void 0 : response.done) {
        res.status(http_status_1.default.OK).send(response);
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.logIn = logIn;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.body) === null || _a === void 0 ? void 0 : _a.token;
    const response = yield (0, auth_service_1.logOutService)(token);
    if (response.done)
        res.status(http_status_1.default.OK).send(response);
    else
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
});
exports.logOut = logOut;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, auth_service_1.forgotPasswordService)(req.body);
    if (response.done) {
        res.status(http_status_1.default.CREATED).send(Object.assign(Object.assign({}, response), { message: "Mail with reset token sent." }));
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, auth_service_1.resetPasswordService)(req.body);
    if (response.done) {
        res.status(http_status_1.default.CREATED).send(Object.assign(Object.assign({}, response), { message: "Password reset." }));
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.resetPassword = resetPassword;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req === null || req === void 0 ? void 0 : req.body;
    const response = yield (0, auth_service_1.refreshTokenService)(token);
    if (response.done) {
        res.status(http_status_1.default.OK).send(response);
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.refreshToken = refreshToken;
const changePasswordOrEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const email = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.email;
    const userName = (_b = (0, auth_1.getStoredUserData)(req)) === null || _b === void 0 ? void 0 : _b.userName;
    const { newEmail, oldPassword, newPassword } = req.body;
    let response;
    if (!newEmail)
        response = yield (0, auth_service_1.changePassword)(userName, oldPassword, newPassword);
    else
        response = yield (0, auth_service_1.alterEmail)(email, newEmail);
    //console.log(response)
    if (!response.done) {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
    else {
        res.status(http_status_1.default.CREATED).send(Object.assign(Object.assign({}, response), { message: "Credentials changed" }));
    }
});
exports.changePasswordOrEmail = changePasswordOrEmail;
