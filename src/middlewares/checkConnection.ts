import express from "express"
import httpStatus from "http-status"
import mongoose from "mongoose"
import { verifyConnection } from "../services/email.service"

const uri = process.env?.MONGO_URI as string

let mongoConnection: mongoose.Connection

export const verifyMongoConnection = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if (!mongoConnection || !(mongoConnection.readyState == mongoose.STATES.connected))
            mongoConnection = (await mongoose.connect(uri)).connection
        return next()
    } catch (error) {
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        return
    }
}

export const verifyMailerConnection = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await verifyConnection()
        if (result) return next()
        else throw new Error()
    } catch (error) {
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        return
    }
}