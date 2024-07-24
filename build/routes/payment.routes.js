"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const payment_validation_1 = require("../validations/payment.validation");
const checkConnection_1 = require("../middlewares/checkConnection");
const router = express_1.default.Router();
router.post("/", (0, auth_1.auth)(), (0, validate_1.validate)(payment_validation_1.handlePaymentReq), checkConnection_1.verifyMongoConnection, payment_controller_1.handlePayment);
exports.default = router;
