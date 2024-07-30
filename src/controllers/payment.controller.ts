import express from "express"
import { addToCart, processPayment } from "../services/payment.service"
import httpStatus from "http-status"
import { getStoredUserData } from "../middlewares/auth"

export const handlePayment = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const response = await processPayment({ ...req.body, userName: userName })
    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.CREATED).send(response)
}

export const testP = async (req: express.Request, res: express.Response) => {
    const invoiceID: string | undefined = req.body?.invoiceID
    const orderItem: { title: string, count: number } = req.body?.orderItem

    const response = await addToCart(orderItem, invoiceID)

    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.CREATED).send(response)
}