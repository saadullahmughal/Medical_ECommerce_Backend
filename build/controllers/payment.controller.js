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
exports.finalizePayment = exports.getMyIntent = exports.getMyCart = exports.addCart = exports.createIntent = void 0;
const payment_service_1 = require("../services/payment.service");
const http_status_1 = __importDefault(require("http-status"));
const auth_1 = require("../middlewares/auth");
const createIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, payment_service_1.placeOrder)(req.body, userName);
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.CREATED).send(response);
});
exports.createIntent = createIntent;
const addCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, payment_service_1.addToCart)(req.body, userName);
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.CREATED).send(response);
});
exports.addCart = addCart;
const getMyCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, payment_service_1.getCart)(req.query["cartID"], userName);
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.OK).send(response);
});
exports.getMyCart = getMyCart;
const getMyIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, payment_service_1.getIntentClientSecret)(req.query["cartID"], userName);
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.OK).send(response);
});
exports.getMyIntent = getMyIntent;
const finalizePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const { capture, clientSecret } = req.body;
    const intent_id = clientSecret.split("_secret_")[0];
    let response;
    if (capture)
        response = yield (0, payment_service_1.capturePayment)(intent_id);
    else
        response = yield (0, payment_service_1.cancelPayment)(intent_id);
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.CREATED).send(response);
});
exports.finalizePayment = finalizePayment;
