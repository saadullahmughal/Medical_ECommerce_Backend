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
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const payment_validation_1 = require("../validations/payment.validation");
const checkConnection_1 = require("../middlewares/checkConnection");
const stripe_1 = __importDefault(require("stripe"));
const http_status_1 = __importDefault(require("http-status"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.auth)(), (0, validate_1.validate)(payment_validation_1.handlePaymentReq), checkConnection_1.verifyMongoConnection, payment_controller_1.handlePayment);
router.post("/test", checkConnection_1.verifyMongoConnection, payment_controller_1.testP);
const testStripe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { cardName, cardExpM, cardExpY, cardCvc, cardNum } = req.body;
        const stripe = new stripe_1.default(((_a = process.env) === null || _a === void 0 ? void 0 : _a.STRIPE_PUBLISH_KEY) || "");
        const card = yield stripe.paymentMethods.create({ type: "card", card: { number: cardNum, exp_month: cardExpM, exp_year: cardExpY, cvc: cardCvc } });
        res.send(card.id);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error.message);
    }
});
router.post("/tokenize", testStripe);
exports.default = router;
