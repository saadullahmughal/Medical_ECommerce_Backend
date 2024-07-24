import express from "express"
import { handlePayment } from "../controllers/payment.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { handlePaymentReq } from "../validations/payment.validation"
import { verifyMongoConnection } from "../middlewares/checkConnection"

const router = express.Router()

router.post("/", auth(), validate(handlePaymentReq), verifyMongoConnection, handlePayment)




export default router