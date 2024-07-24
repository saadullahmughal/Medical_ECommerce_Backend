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
exports.alterEmail = exports.changePassword = exports.refreshTokenService = exports.resetPasswordService = exports.forgotPasswordService = exports.logOutService = exports.logInService = exports.signUpService = exports.genHash = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../utils/token");
const refreshToken_model_1 = __importDefault(require("../models/refreshToken.model"));
const email_service_1 = require("./email.service");
const form_model_1 = __importDefault(require("../models/form.model"));
const errorParser_1 = require("../utils/errorParser");
require("dotenv").config();
const saltRounds = 12;
const salt = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.BCRYPT_SALT) || "";
const genHash = (text) => bcrypt_1.default.hashSync(text, salt);
exports.genHash = genHash;
const signUpService = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let record = Object.assign(Object.assign({}, reqBody), { password: bcrypt_1.default.hashSync(reqBody === null || reqBody === void 0 ? void 0 : reqBody.password, salt) });
        const result = yield user_model_1.default.create(record);
        return { done: true };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.signUpService = signUpService;
const logInService = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let record = {
            password: bcrypt_1.default.hashSync(reqBody === null || reqBody === void 0 ? void 0 : reqBody.password, salt),
            userName: reqBody === null || reqBody === void 0 ? void 0 : reqBody.userName,
        };
        const userFound = yield user_model_1.default.findOne(record);
        if (!userFound)
            return { done: false, reason: "Invalid credentials" };
        const tokenPayload = Object.assign({}, userFound.toObject());
        delete tokenPayload["password"];
        let refreshToken = (0, token_1.genToken)({ uid: tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.userName }, "300d");
        yield refreshToken_model_1.default.create({ token: refreshToken });
        let token = (_a = (0, token_1.genToken)(tokenPayload, 3600)) === null || _a === void 0 ? void 0 : _a.toString();
        return { done: true, access: token || "", refresh: refreshToken || "" };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.logInService = logInService;
const logOutService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteResults = yield refreshToken_model_1.default.deleteOne({ token: token });
        if (deleteResults.deletedCount != 0)
            return { done: true };
        else
            return { done: false, message: "Invalid Request" };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.logOutService = logOutService;
const forgotPasswordService = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ userName: reqBody === null || reqBody === void 0 ? void 0 : reqBody.userName });
        console.log(1);
        if (!user)
            return { done: false, message: "No such user exists" };
        else {
            console.log("Found");
            const result = yield (0, email_service_1.sendResetLink)(user === null || user === void 0 ? void 0 : user.email);
            return { done: true };
        }
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.forgotPasswordService = forgotPasswordService;
const resetPasswordService = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = reqBody;
        if (!(0, token_1.verifyToken)(token))
            return { done: false, message: "Invalid token" };
        const payload = (0, token_1.getTokenData)(token);
        const passHash = (0, exports.genHash)(password);
        const updateResults = yield user_model_1.default.updateOne({ email: payload === null || payload === void 0 ? void 0 : payload.id }, { $set: { password: passHash } });
        if (updateResults.matchedCount != 0)
            return { done: true };
        else
            return { done: false, message: "Invalid token" };
    }
    catch (error) {
        return { done: false, reason: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.resetPasswordService = resetPasswordService;
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, token_1.verifyToken)(token))
            return { done: false, message: "Invalid token" };
        let tokenPayload = (0, token_1.getTokenData)(token);
        if (!(tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.uid))
            return { done: false, message: "Invalid token" };
        const tokenFound = yield refreshToken_model_1.default.findOne({ token: token });
        if (!tokenFound)
            return { done: false, message: "Invalid token" };
        let userName = tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.uid;
        const userFound = yield user_model_1.default.findOne({ userName: userName });
        if (userFound) {
            let newTokenPayload = Object.assign({}, userFound === null || userFound === void 0 ? void 0 : userFound.toObject());
            let newRefreshToken = (0, token_1.genToken)({ uid: newTokenPayload === null || newTokenPayload === void 0 ? void 0 : newTokenPayload.email }, "300d");
            yield refreshToken_model_1.default.findOneAndUpdate({ token: token }, { token: newRefreshToken });
            let newAccessToken = (0, token_1.genToken)(newTokenPayload, 120);
            return { done: true, access: newAccessToken, refresh: newRefreshToken };
        }
        else {
            return { done: false, message: "Invalid token" };
        }
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.refreshTokenService = refreshTokenService;
const changePassword = (userName, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield user_model_1.default.updateOne({ userName: userName, password: (0, exports.genHash)(oldPassword) }, { password: (0, exports.genHash)(newPassword) }).exec();
        if (updated.matchedCount == 0)
            return { done: false, message: "Something went wrong" };
        else
            return { done: true };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.changePassword = changePassword;
const alterEmail = (oldEmail, newEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let updated = yield user_model_1.default.updateOne({ email: oldEmail }, { email: newEmail }, { session }).exec();
        if (updated.matchedCount == 0)
            throw new Error("Something went wrong");
        updated = yield form_model_1.default.updateOne({ email: oldEmail }, { email: newEmail }, { session }).exec();
        if (updated.matchedCount == 0)
            throw new Error("Something went wrong");
        yield session.commitTransaction();
        yield session.endSession();
        return { done: true };
    }
    catch (error) {
        console.error(error);
        yield session.abortTransaction();
        yield session.endSession();
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.alterEmail = alterEmail;
