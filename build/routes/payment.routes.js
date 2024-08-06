"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const payment_validation_1 = require("../validations/payment.validation");
const checkConnection_1 = require("../middlewares/checkConnection");
const http_status_1 = __importDefault(require("http-status"));
const router = express_1.default.Router();
router.post("/create-intent", (0, auth_1.auth)(), (0, validate_1.validate)(payment_validation_1.createIntentReq), checkConnection_1.verifyMongoConnection, payment_controller_1.createIntent);
router.post("/finalize", (0, auth_1.auth)(), (0, validate_1.validate)(payment_validation_1.finalizePaymentReq), checkConnection_1.verifyMongoConnection, payment_controller_1.finalizePayment);
const publishKey = (_a = process.env) === null || _a === void 0 ? void 0 : _a.STRIPE_PUBLISH_KEY;
router.get("/config", (0, auth_1.auth)(), (req, res) => res.status(publishKey ? http_status_1.default.OK : http_status_1.default.EXPECTATION_FAILED).send({ PUBLISH_KEY: publishKey || "N/A" }));
exports.default = router;
