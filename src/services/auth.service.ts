import httpStatus from "http-status";
import mongoose from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { genToken, verifyToken } from "../utils/token";
import RefreshTokens from "../models/refreshToken.model";
import { sendResetLink } from "./email.service";
require("dotenv").config();

const saltRounds = 12;
const salt = process.env?.BCRYPT_SALT || "";

const adminExists = async (email: String) => {
    let r = await User.findOne({ email: email });
    return r != null;
};

export const genHash = (text: string) => bcrypt.hashSync(text, salt);

export const signUpService = async (reqBody: Record<string, any>) => {
    if (!reqBody?.userName || !reqBody?.email || !reqBody?.password) {
        return false;
    }
    let record = {
        userName: reqBody?.userName,
        password: bcrypt.hashSync(reqBody?.password, salt),
        email: reqBody?.email,
    };
    return User.create(record)
        .then((result) => {
            return true;
        })
        .catch((err) => {
            console.error(err);
            return false;
        });
};

export const logInService = async (reqBody: Record<string, any>) => {
    if (!reqBody?.userName || !reqBody?.password) {
        return {
            access: "",
            refresh: "",
        };
    }
    let record = {
        password: bcrypt.hashSync(reqBody?.password, salt),
        userName: reqBody?.userName,
    };
    return User.findOne(record)
        .then((result) => {
            if (!result) return {
                access: "",
                refresh: "",
            };
            const tokenPayload = {
                ...result.toObject(),
            };
            let refreshToken = genToken(
                { uid: tokenPayload?.userName },
                "300d"
            );
            return RefreshTokens.create({ token: refreshToken }).then(
                (value) => {
                    let token = genToken(tokenPayload, 3600)?.toString();
                    return { access: token?.toString(), refresh: refreshToken?.toString() };
                }
            );
        })
        .catch((err) => {
            console.error(err);
            return {
                access: "",
                refresh: "",
            };
        });
};

export const logOutService = async (token: string) => {
    if (!verifyToken(token)) return true;
    return RefreshTokens.deleteOne({ token: token })
        .then((resolve) => {
            return true;
        })
        .catch((error) => {
            console.error(error);
            return false;
        });
};

export const forgotPasswordService = async (reqBody: { email: string; }) => {
    //console.log(reqBody);
    if (!reqBody?.email) return false;
    let exists = await adminExists(reqBody?.email);
    //console.log(email, exists);
    if (!exists) return false;
    else
        return sendResetLink(reqBody?.email)
            .then((result) => {
                return result;
            })
            .catch((error) => {
                return false;
            });
};

export const resetPasswordService = async (reqBody: { token: string; password: string; }) => {
    if (!reqBody?.token && !reqBody?.password) return false;
    const token = reqBody?.token;
    if (!verifyToken(token)) return false;
    const payload = jwt.decode(token) as JwtPayload;
    const passHash = bcrypt.hashSync(reqBody?.password, salt);
    return User.findOneAndUpdate(
        { email: payload?.id },
        { $set: { password: passHash } }
    )
        .then((value) => {
            console.log(true);
            return true;
        })
        .catch((error) => {
            console.error(error);
            return false;
        });
};

export const refreshTokenService = async (token: string) => {
    if (!verifyToken(token)) return {
        access: "",
        refresh: "",
    };

    let tokenPayload = jwt.decode(token) as any;
    //console.log(tokenPayload);
    if (!tokenPayload?.uid) return {
        access: "",
        refresh: "",
    };
    //console.log("Valid Token");
    const tokenFound = await RefreshTokens.findOne({ token: token });
    if (!tokenFound) return {
        access: "",
        refresh: "",
    };
    //console.log("Token found in DB");
    //console.log("Token payload: ", tokenPayload);
    let userName = tokenPayload?.uid;
    //console.log(userName);
    const userFound = await User.findOne({ userName: userName });
    if (userFound) {
        //console.log("User found");
        //console.log("User: ", userFound.toObject());
        let newTokenPayload = { ...userFound?.toObject() };
        let newRefreshToken = genToken(
            { uid: newTokenPayload?.email },
            "300d"
        );
        await RefreshTokens.findOneAndUpdate({ token: token }, { token: newRefreshToken });
        let newAccessToken = genToken(newTokenPayload, 120);
        return { access: newAccessToken, refresh: newRefreshToken };
    } else {
        //console.log(userFound);
        return {
            access: "",
            refresh: "",
        };
    }
};

