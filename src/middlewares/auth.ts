import express from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { getTokenData, verifyToken } from "../utils/token";
import Joi from "joi";
import { AuthToken } from "../validations/auth.validation";

export const getAuthToken = (req: express.Request) => {
    return req.headers.authorization?.split(" ", 2)?.[1];
}

export const auth = (role?: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = getAuthToken(req);
    if (!token) {
        res.sendStatus(httpStatus.UNAUTHORIZED);
        return;
    }
    const tokenSignOK = verifyToken(token);
    if (tokenSignOK) {
        const tokenPayload = jwt.decode(token)
        if (!AuthToken.validate(tokenPayload).error)
            if (!role) return next();
            else {
                const userRole = getTokenData(token)?.role;
                if (userRole == role) return next();
                else {
                    res.sendStatus(httpStatus.FORBIDDEN);
                    return;
                }
            }
    }
    res.sendStatus(httpStatus.UNAUTHORIZED);
};

export const authIgnoringExpiry = (role?: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //if (!role) role = "user";
    console.log("Validat");
    if (role) console.log("Required role: ", role);
    //const resourceUrl = req?.baseUrl + req?.url.split("?")[0];
    const token = getAuthToken(req);
    //console.log(".......")
    if (!token) {
        res.sendStatus(httpStatus.UNAUTHORIZED);
        return;
    }
    //console.log(token);
    const authorized = verifyToken(token, true);
    if (authorized) {
        if (!role) return next();
        else {
            const userRole = getTokenData(token)?.role;
            console.log("User role: ", userRole);
            if (userRole == role) return next();
            else {
                res.sendStatus(httpStatus.FORBIDDEN);
                return;
            }
        }
    }
    res.sendStatus(httpStatus.UNAUTHORIZED);
};

export const getStoredUserData = (req: express.Request) => {
    return getTokenData(getAuthToken(req) || "");
}