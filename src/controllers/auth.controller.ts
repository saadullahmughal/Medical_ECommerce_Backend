import httpStatus from "http-status";
import { logInService, logOutService, resetPasswordService, refreshTokenService, forgotPasswordService, signUpService, alterEmail, changePassword } from "../services/auth.service";
import express from "express";
import RefreshTokens from "../models/refreshToken.model";
import { getAuthToken, getStoredUserData } from "../middlewares/auth";


export const signUp = async (req: express.Request, res: express.Response) => {
    const response = await signUpService(req.body);
    if (response.done) {
        res.status(httpStatus.CREATED).send(response)
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response)
    }
};


export const logIn = async (req: express.Request, res: express.Response) => {
    const response = await logInService(req.body);
    if (response?.done) {
        res.status(httpStatus.OK).send(response);
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response);
    }
};

export const logOut = async (req: express.Request, res: express.Response) => {
    const token = req.body?.token as string
    const response = await logOutService(token)
    if (response.done) res.status(httpStatus.OK).send(response)
    else res.status(httpStatus.EXPECTATION_FAILED).send(response)
}

export const forgotPassword = async (req: express.Request, res: express.Response) => {
    const response = await forgotPasswordService(req.body);
    if (response.done) {
        res.status(httpStatus.CREATED).send({ ...response, message: "Mail with reset token sent." });
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response);
    }
};


export const resetPassword = async (req: express.Request, res: express.Response) => {
    const response = await resetPasswordService(req.body)
    if (response.done) {
        res.status(httpStatus.CREATED).send({ ...response, message: "Password reset." })
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response)
    }
};


export const refreshToken = async (req: express.Request, res: express.Response) => {
    const { token } = req?.body;
    const response = await refreshTokenService(token);
    if (response.done) {
        res.status(httpStatus.OK).send(response);
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response);
    }
};

export const changePasswordOrEmail = async (req: express.Request, res: express.Response) => {
    const email = getStoredUserData(req)?.email
    const userName = getStoredUserData(req)?.userName
    const { newEmail, oldPassword, newPassword } = req.body
    let response
    if (!newEmail)
        response = await changePassword(userName, oldPassword, newPassword)
    else response = await alterEmail(email, newEmail)
    //console.log(response)
    if (!response.done) {
        res.status(httpStatus.EXPECTATION_FAILED).send(response);
    } else {
        res.status(httpStatus.CREATED).send({ ...response, message: "Credentials changed" })
    }

}