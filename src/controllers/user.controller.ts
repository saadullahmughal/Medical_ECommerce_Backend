import express from "express";
import { alterEmail, changePassword, getUserData, updateUserData } from "../services/user.service";
import { CREATED, EXPECTATION_FAILED, OK } from "http-status";
import { getStoredUserData } from "../middlewares/auth";

export const getUser = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName;
    const response = await getUserData(userName);
    if (!response) {
        res.status(EXPECTATION_FAILED).send("Failed to fetch");
    } else {
        res.status(OK).send(response)
    }
}

export const ChangePassword = async (req: express.Request, res: express.Response) => {
    const { oldPassword, newPassword } = req.body
    const userName = getStoredUserData(req)?.userName
    const response = await changePassword(userName, oldPassword, newPassword)
    //console.log(response)
    if (!response) {
        res.status(EXPECTATION_FAILED).send("Failed to change the password");
    } else {
        res.status(CREATED).send("Password changed successfully")
    }    
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const userData = req.body
    const response = await updateUserData(userName, userData)
    //console.log(response)
    if (!response) {
        res.status(EXPECTATION_FAILED).send("Failed to update");
    } else {
        res.status(CREATED).send("Data updated")
    }
}

export const changePasswordOrEmail = async (req: express.Request, res: express.Response) => {
    const email = getStoredUserData(req)?.email
    const userName = getStoredUserData(req)?.userName
    const { newEmail, oldPassword, newPassword } = req.body
    let response
    if(!newEmail)
        response = await changePassword(userName, oldPassword, newPassword)
    else response = await alterEmail(email, newEmail)
    //console.log(response)
    if (!response) {
        res.status(EXPECTATION_FAILED).send("Failed to change");
    } else {
        res.status(CREATED).send("Data updated")
    }

}