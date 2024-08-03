import express from "express"
import { createIntent, finalizePayment } from "../controllers/payment.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { createIntentReq, finalizePaymentReq } from "../validations/payment.validation"
import { verifyMongoConnection } from "../middlewares/checkConnection"

const router = express.Router()

router.post("/create-intent", auth(), validate(createIntentReq), verifyMongoConnection, createIntent)

router.post("/finalize", auth(), validate(finalizePaymentReq), verifyMongoConnection, finalizePayment)

export default router