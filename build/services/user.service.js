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
exports.updateUserData = exports.getUserData = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_service_1 = require("./auth.service");
const errorParser_1 = require("../utils/errorParser");
const getUserData = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFound = yield user_model_1.default.findOne({ userName: userName }).select({ password: 0 }).exec();
        if (!userFound)
            return { done: false, message: "Something went wrong" };
        else
            return { done: true, message: userFound.toObject() };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.getUserData = getUserData;
const updateUserData = (userName, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRecord = Object.assign(Object.assign({}, userData), { password: (userData === null || userData === void 0 ? void 0 : userData.password) ? (0, auth_service_1.genHash)(userData === null || userData === void 0 ? void 0 : userData.password) : undefined });
        const updated = yield user_model_1.default.updateOne({ userName: userName }, newRecord);
        if (updated.matchedCount == 0)
            return { done: false, message: "Something went wrong" };
        else
            return { done: true };
    }
    catch (error) {
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.updateUserData = updateUserData;
