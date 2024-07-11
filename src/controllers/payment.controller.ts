import express from "express";
import { processPayment } from "../services/payment.service";
import httpStatus from "http-status";

export const handlePayment = async (req: express.Request, res: express.Response) => {
    try {
        const paymentInfo = req.body as Record<string, any>;
        const response = await processPayment(paymentInfo);
        if (!response) res.status(httpStatus.EXPECTATION_FAILED).send("Failed");
        else res.status(httpStatus.CREATED).send({ transactionID: response });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.EXPECTATION_FAILED).send("Failed");
    }
};