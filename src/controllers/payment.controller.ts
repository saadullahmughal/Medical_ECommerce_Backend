import express from "express"
import { addToCart, processPayment, processPaymentv2 } from "../services/payment.service"
import httpStatus from "http-status"
import { getStoredUserData } from "../middlewares/auth"

export const handlePayment = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const response = await processPayment({ ...req.body, userName: userName })
    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.CREATED).send(response)
}

export const handlePaymentv2 = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const response = await processPaymentv2({ ...req.body, userName: userName })
    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.CREATED).send(response)
}

export const addCart = async (req: express.Request, res: express.Response) => {
    const invoiceID: string | undefined = req.body?.invoiceID
    const orderItem: { title: string, count: number } = req.body?.orderItem

    const response = await addToCart(orderItem, invoiceID)

    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.CREATED).send(response)
}