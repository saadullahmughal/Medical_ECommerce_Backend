import express from "express"
import httpStatus from "http-status"
import jwt from "jsonwebtoken"
import { getTokenData, verifyToken } from "../utils/token"
import Joi from "joi"
import { AuthToken } from "../validations/auth.validation"

export const getAuthToken = (req: express.Request) => {
    return req.headers.authorization?.split(" ", 2)?.[1]
}

export const auth = (role?: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = getAuthToken(req)
    if (!token) {
        res.sendStatus(httpStatus.UNAUTHORIZED)
        return
    }
    const tokenSignOK = verifyToken(token)
    if (tokenSignOK) {
        const tokenPayload = jwt.decode(token)
        if (!AuthToken.validate(tokenPayload, { allowUnknown: true }).error) {
            if (!role) return next()
            else {
                const userRole = getTokenData(token)?.role
                if (userRole == role) return next()
                else {
                    res.sendStatus(httpStatus.FORBIDDEN)
                    return
                }
            }
        }
    }
    res.sendStatus(httpStatus.UNAUTHORIZED)
}

export const authIgnoringExpiry = (role?: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = getAuthToken(req)
    if (!token) {
        res.sendStatus(httpStatus.UNAUTHORIZED)
        return
    }
    const tokenSignOK = verifyToken(token, true)
    if (tokenSignOK) {
        const tokenPayload = jwt.decode(token)
        if (!AuthToken.validate(tokenPayload, { allowUnknown: true }).error) {
            if (!role) return next()
            else {
                const userRole = getTokenData(token)?.role
                if (userRole == role) return next()
                else {
                    res.sendStatus(httpStatus.FORBIDDEN)
                    return
                }
            }
        }
    }
    res.sendStatus(httpStatus.UNAUTHORIZED)
}

export const getStoredUserData = (req: express.Request) => {
    return getTokenData(getAuthToken(req) || "")
}