"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoredUserData = exports.authIgnoringExpiry = exports.auth = exports.getAuthToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../utils/token");
const auth_validation_1 = require("../validations/auth.validation");
const getAuthToken = (req) => {
    var _a, _b;
    return (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ", 2)) === null || _b === void 0 ? void 0 : _b[1];
};
exports.getAuthToken = getAuthToken;
const auth = (role) => (req, res, next) => {
    var _a;
    const token = (0, exports.getAuthToken)(req);
    if (!token) {
        res.sendStatus(http_status_1.default.UNAUTHORIZED);
        return;
    }
    const tokenSignOK = (0, token_1.verifyToken)(token);
    if (tokenSignOK) {
        const tokenPayload = jsonwebtoken_1.default.decode(token);
        if (!auth_validation_1.AuthToken.validate(tokenPayload, { allowUnknown: true }).error) {
            if (!role)
                return next();
            else {
                const userRole = (_a = (0, token_1.getTokenData)(token)) === null || _a === void 0 ? void 0 : _a.role;
                if (userRole == role)
                    return next();
                else {
                    res.sendStatus(http_status_1.default.FORBIDDEN);
                    return;
                }
            }
        }
    }
    res.sendStatus(http_status_1.default.UNAUTHORIZED);
};
exports.auth = auth;
const authIgnoringExpiry = (role) => (req, res, next) => {
    var _a;
    const token = (0, exports.getAuthToken)(req);
    if (!token) {
        res.sendStatus(http_status_1.default.UNAUTHORIZED);
        return;
    }
    const tokenSignOK = (0, token_1.verifyToken)(token, true);
    if (tokenSignOK) {
        const tokenPayload = jsonwebtoken_1.default.decode(token);
        if (!auth_validation_1.AuthToken.validate(tokenPayload, { allowUnknown: true }).error) {
            if (!role)
                return next();
            else {
                const userRole = (_a = (0, token_1.getTokenData)(token)) === null || _a === void 0 ? void 0 : _a.role;
                if (userRole == role)
                    return next();
                else {
                    res.sendStatus(http_status_1.default.FORBIDDEN);
                    return;
                }
            }
        }
    }
    res.sendStatus(http_status_1.default.UNAUTHORIZED);
};
exports.authIgnoringExpiry = authIgnoringExpiry;
const getStoredUserData = (req) => {
    return (0, token_1.getTokenData)((0, exports.getAuthToken)(req) || "");
};
exports.getStoredUserData = getStoredUserData;
