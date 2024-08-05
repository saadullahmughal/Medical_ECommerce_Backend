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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetLink = exports.verifyConnection = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const token_1 = require("../utils/token");
const errorParser_1 = require("../utils/errorParser");
require("dotenv").config();
const emailPassword = (_a = process.env) === null || _a === void 0 ? void 0 : _a.EMAIL_PASSWORD;
const emailID = (_b = process.env) === null || _b === void 0 ? void 0 : _b.EMAIL_ID;
const emailTitle = (_c = process.env) === null || _c === void 0 ? void 0 : _c.EMAIL_TITLE;
const transporter = nodemailer_1.default.createTransport({
    pool: true,
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: emailID,
        pass: emailPassword,
    },
});
const verifyConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!transporter.isIdle) {
            const result = yield transporter.verify();
            return result;
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
exports.verifyConnection = verifyConnection;
const sendResetLink = (receipt) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, exports.verifyConnection)())
        return false;
    let expires = Date.now() + 15 * 60;
    const ResetToken = (0, token_1.genToken)({ id: receipt }, "15min");
    let message = {
        from: emailTitle + "<" + emailID + ">",
        to: receipt,
        subject: "Password Reset Token",
        html: "You can reset your password using the token: <br><b>" +
            ResetToken +
            "</b> <br>If you didn't ask for such a token, please ignore the mail and don't share the token. Token will expire in 15 minutes.",
    };
    try {
        yield transporter.sendMail(message);
        return { done: true };
    }
    catch (error) {
        console.error(error);
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.sendResetLink = sendResetLink;
