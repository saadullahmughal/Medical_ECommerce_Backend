"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.getTokenData = exports.genToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv").config();
const tokenSign = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_TOKEN_SIGNATURE) || "";
const genToken = function (payload, expires) {
    try {
        return (0, jsonwebtoken_1.sign)(payload, tokenSign, { expiresIn: expires });
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.genToken = genToken;
const getTokenData = (token) => {
    try {
        let payload = (0, jsonwebtoken_1.verify)(token, tokenSign);
        //console.log(payload)
        return payload;
    }
    catch (error) {
        return {};
    }
};
exports.getTokenData = getTokenData;
const verifyToken = function (token, ignoreExpiry) {
    try {
        //if (!ignoreExpiry) ignoreExpiry = false
        let payload = (0, jsonwebtoken_1.verify)(token, tokenSign, { ignoreExpiration: ignoreExpiry });
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.verifyToken = verifyToken;
