import express from "express"
import { handlePayment } from "../controllers/payment.controller"
import { auth } from "../middlewares/auth"

const router = express.Router()

router.post("/", auth, handlePayment);




export default router