import express from "express"
import { cancelPayment, capturePayment, placeOrder } from "../services/payment.service"
import httpStatus from "http-status"
import { getStoredUserData } from "../middlewares/auth"

export const createIntent = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const response = await placeOrder(req.body, userName)
    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.CREATED).send(response)
}

export const finalizePayment = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const { capture, clientSecret } = req.body
    const intent_id = (clientSecret as string).split("_secret_")[0]
    let response
    if (capture) response = await capturePayment(intent_id)
    else response = await cancelPayment(intent_id)
    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.CREATED).send(response)
}
