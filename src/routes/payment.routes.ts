import express from "express"
import { handlePayment, testP } from "../controllers/payment.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { handlePaymentReq } from "../validations/payment.validation"
import { verifyMongoConnection } from "../middlewares/checkConnection"
import Stripe from "stripe"
import httpStatus from "http-status"

const router = express.Router()

router.post("/", auth(), validate(handlePaymentReq), verifyMongoConnection, handlePayment)
router.post("/test", verifyMongoConnection, testP)


const testStripe = async (req: express.Request, res: express.Response) => {
    try {
        const { cardName, cardExpM, cardExpY, cardCvc, cardNum } = req.body
        const stripe = new Stripe(process.env?.STRIPE_PUBLISH_KEY || "")
        const card = await stripe.paymentMethods.create({ type: "card", card: { number: cardNum, exp_month: cardExpM, exp_year: cardExpY, cvc: cardCvc } })
        res.send(card.id)
    } catch (error) {
        console.error(error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send((error as Stripe.errors.StripeError).message)
    }

}

router.post("/tokenize", testStripe)

export default router