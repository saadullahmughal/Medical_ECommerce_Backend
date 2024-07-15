import express from "express"
import { handlePayment } from "../controllers/payment.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate";
import { handlePaymentReq } from "../validations/payment.validation";

const router = express.Router()

router.post("/", auth(), validate(handlePaymentReq), handlePayment);




export default router