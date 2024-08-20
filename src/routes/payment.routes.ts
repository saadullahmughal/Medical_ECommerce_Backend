import express from "express"
import { addCart, createIntent, finalizePayment, getMyCart, getMyIntent } from "../controllers/payment.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { addCartReq, createIntentReq, finalizePaymentReq, getCartReq } from "../validations/payment.validation"
import { verifyMongoConnection } from "../middlewares/checkConnection"
import httpStatus from "http-status"

const router = express.Router()

router.post("/addToCart", auth(), validate(addCartReq), verifyMongoConnection, addCart)
//router.post("/create-intent", auth(), validate(createIntentReq), verifyMongoConnection, createIntent)
router.get("/getCart", auth(), validate(getCartReq), verifyMongoConnection, getMyCart)
router.get("/getClientSecret", auth(), validate(getCartReq), verifyMongoConnection, getMyIntent)

router.post("/finalize", auth(), validate(finalizePaymentReq), verifyMongoConnection, finalizePayment)

const publishKey = process.env?.STRIPE_PUBLISH_KEY as string
router.get("/config", auth(), (req, res) => res.status(publishKey ? httpStatus.OK : httpStatus.EXPECTATION_FAILED).send({ PUBLISH_KEY: publishKey || "N/A" }))


export default router