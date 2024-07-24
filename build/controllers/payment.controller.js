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
exports.handlePayment = void 0;
const payment_service_1 = require("../services/payment.service");
const http_status_1 = __importDefault(require("http-status"));
const auth_1 = require("../middlewares/auth");
const handlePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, payment_service_1.processPayment)(Object.assign(Object.assign({}, req.body), { userName: userName }));
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.CREATED).send(response);
});
exports.handlePayment = handlePayment;
