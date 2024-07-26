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
exports.verifyMailerConnection = exports.verifyMongoConnection = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const email_service_1 = require("../services/email.service");
const uri = (_a = process.env) === null || _a === void 0 ? void 0 : _a.MONGO_URI;
let mongoConnection;
const verifyMongoConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoConnection)
            mongoConnection = (yield mongoose_1.default.connect(uri)).connection;
        return next();
    }
    catch (error) {
        res.sendStatus(http_status_1.default.INTERNAL_SERVER_ERROR);
        return;
    }
});
exports.verifyMongoConnection = verifyMongoConnection;
const verifyMailerConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, email_service_1.verifyConnection)();
        if (result)
            return next();
        else
            throw new Error();
    }
    catch (error) {
        res.sendStatus(http_status_1.default.INTERNAL_SERVER_ERROR);
        return;
    }
});
exports.verifyMailerConnection = verifyMailerConnection;
