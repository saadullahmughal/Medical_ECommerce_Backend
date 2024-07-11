import httpStatus from "http-status";
import {logInService,  logOutService, resetPasswordService, refreshTokenService, forgotPasswordService, signUpService} from "../services/auth.service";
import express from "express";
import RefreshTokens from "../models/refreshToken.model";


export const signUp = async (req: express.Request, res: express.Response) => {
    const {userName,email,password}= req.body
    const query = {userName:  userName ? userName.toString(): "", password: password ? password.toString(): "", email: email ? email.toString(): ""};
    const response = await signUpService(query);
    if (response) {
        res.status(httpStatus.CREATED).send({
            status: "OK",
            user: query?.userName,
        });
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send({
            status: "Failed",
            user: query?.userName,
        });
    }
};


export const logIn = async (req: express.Request, res: express.Response) => {
    const userName = req.body?.userName;
    const password = req.body?.password;
    const query = { userName: userName ? userName.toString() : "", password: password ? password.toString() : "" };
    //console.log(req.body);
    const response = await logInService(query);
    if (response.access != "" && response.refresh != "") {
        res.status(httpStatus.OK).send(response);
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send("Failed");
    }
};

export const logOut = async (req: express.Request, res: express.Response) => {
    let decision = false;
    const reqBody = req.body as Record<string, any>;
    const token = reqBody?.token;
    if (!token) decision = true;
    if (!decision) decision = await logOutService(token);
    if (decision) {
        try {
            await RefreshTokens.deleteOne({ token: token });
            res.status(httpStatus.OK).send("Logged-Out");
        } catch (error) {
            res.status(httpStatus.EXPECTATION_FAILED).send("Failed");
        }
    } else res.status(httpStatus.EXPECTATION_FAILED).send("Failed");
};

export const forgotPassword = async (req: express.Request, res: express.Response) => {
    const email = req.body?.email;
    const query = { email: email ? email.toString() : "" };
    //if (!query) return false;
    //console.log("Controller");
    const response = await forgotPasswordService(query);
    if (response) {
        res.status(httpStatus.CREATED).send("Mail with reset token sent.");
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send("Something went wrong");
    }
};


export const resetPassword = async (req: express.Request, res: express.Response) => {
    
    const token = req.body?.token;
    const password = req.body?.password;
    const query = { token: token ? token.toString() : "", password: password ? password.toString() : "" };
    //if (!query) return false;
    //console.log("Controller");
    const response = await resetPasswordService(query);
    if (response) {
        res.status(httpStatus.CREATED).send("Password reset.");
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send("Something went wrong.");
    }
};


export const refreshToken = async (req: express.Request, res: express.Response) => {
    const token = req?.body?.["token"];
    console.log(token);
    const response = await refreshTokenService(token);
    if (response.access != "" && response.refresh!="") {
        res.status(httpStatus.OK).send(response);
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send("Failed");
    }
};

