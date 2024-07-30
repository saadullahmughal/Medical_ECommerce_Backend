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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe_1 = require("stripe");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const stripeKey = (_a = process.env) === null || _a === void 0 ? void 0 : _a.STRIPE_KEY;
const stripeInstance = new stripe_1.Stripe(stripeKey);
const testFn = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const number = "4242424242424242";
        const customer = yield stripeInstance.customers.create({ name: "Saadullah", "email": "saad@saad.dev" });
        console.log("Customer created:", customer.id);
        const card = yield stripeInstance.tokens.create({ card: { name: "M Saadullah Zafar", number: number, exp_month: "12", exp_year: "2025", cvc: "123", currency: "PKR" } });
        console.log("Card added:", card.id);
        //await stripeInstance.customers.createSource(customer.id, { source: "tok_visa" })
        //const payment = await stripeInstance.paymentIntents.create({ amount: 5000, currency: "pkr", payment_method: card.id })
        //const results = await stripeInstance.paymentIntents.confirm(payment.id)
        //const results = await stripeInstance.charges.create({ amount: 500 * 100, customer: customer.id, currency: "pkr" })
        const paymentIntent = yield stripeInstance.paymentIntents.create({ amount: 500 * 100, currency: "pkr", payment_method: "tok_visa", customer: customer.id });
        console.log("PaymentIntent generated:", paymentIntent.id);
        const results = yield stripeInstance.paymentIntents.confirm(paymentIntent.id);
        console.log("Confirmed:", results.id);
        //console.log(results.id)
    }
    catch (error) {
        //console.error((error as Stripe.errors.StripeError).code || "ERROR")
        console.error(error);
    }
    // const paymentIntent = await stripeInstance.paymentIntents.create({
    //     amount: 500,
    //     currency: "gbp",
    //     payment_method: "pm_card_visa",
    // });
});
testFn();
