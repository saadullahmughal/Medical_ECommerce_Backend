import express from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { getTokenData, verifyToken } from "../utils/token";

const getAuthToken = (req: express.Request) => {
    return req.headers.authorization?.split(" ", 2)?.[1];
}

export const auth = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const resourceUrl = req?.baseUrl + req?.url.split("?")[0];
    const token = getAuthToken(req);
    //console.log(".......")
    if (!token) {
        res.status(httpStatus.UNAUTHORIZED).send("Unauthorized");
        return;
    }
    //console.log(token);
    const authorized = verifyToken(token);
    if (authorized) return next();
    res.status(httpStatus.UNAUTHORIZED).send("Unauthorized");
};

export const getStoredUserData = (req: express.Request) => {
    return getTokenData(getAuthToken(req) || "");
}