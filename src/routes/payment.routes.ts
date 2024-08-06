import express from "express"
import { createIntent, finalizePayment } from "../controllers/payment.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { createIntentReq, finalizePaymentReq } from "../validations/payment.validation"
import { verifyMongoConnection } from "../middlewares/checkConnection"
import httpStatus from "http-status"

const router = express.Router()

router.post("/create-intent", auth(), validate(createIntentReq), verifyMongoConnection, createIntent)

router.post("/finalize", auth(), validate(finalizePaymentReq), verifyMongoConnection, finalizePayment)

const publishKey = process.env?.STRIPE_PUBLISH_KEY as string
router.get("/config", auth(), (req, res) => res.status(publishKey ? httpStatus.OK : httpStatus.EXPECTATION_FAILED).send({ PUBLISH_KEY: publishKey || "N/A" }))


export default router