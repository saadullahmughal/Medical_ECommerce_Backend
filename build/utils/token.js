"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.getTokenData = exports.genToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenSign = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_TOKEN_SIGNATURE) || "";
const genToken = function (payload, expires) {
    try {
        console.log("Expiry in ", expires);
        return (0, jsonwebtoken_1.sign)(payload, tokenSign, { expiresIn: expires });
    }
    catch (_a) {
        console.error("Token generation failed");
        return null;
    }
};
exports.genToken = genToken;
const getTokenData = (token) => {
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, tokenSign);
        //console.log(payload)
        return payload;
    }
    catch (_a) {
        return {};
    }
};
exports.getTokenData = getTokenData;
const verifyToken = function (token, ignoreExpiry) {
    try {
        //if (!ignoreExpiry) ignoreExpiry = false
        (0, jsonwebtoken_1.verify)(token, tokenSign, { ignoreExpiration: ignoreExpiry });
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.verifyToken = verifyToken;
