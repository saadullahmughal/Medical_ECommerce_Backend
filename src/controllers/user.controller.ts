import express from "express";
import { getUserData, updateUserData } from "../services/user.service";
import httpStatus, { CREATED, EXPECTATION_FAILED, OK } from "http-status";
import { getStoredUserData } from "../middlewares/auth";
import { UploadedFile } from "express-fileupload";
import { saveImage } from "../services/fileServer.service";

export const getUser = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName;
    const response = await getUserData(userName);
    if (!response.done) {
        res.status(EXPECTATION_FAILED).send(response);
    } else {
        res.status(OK).send(response)
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const userData = req.body
    const response = await updateUserData(userName, userData)
    if (response.done) {
        res.status(CREATED).send({ ...response, message: "Data updated" })
    } else {
        res.status(EXPECTATION_FAILED).send(response)
    }
}

export const addProfilePic = async (req: express.Request, res: express.Response) => {
    const userName = getStoredUserData(req)?.userName
    const image = req.files?.image as UploadedFile
    let savedName = ""
    if (!image) res.status(httpStatus.BAD_REQUEST).send("No profile image uploaded")
    else {
        const imgDirPath = "images"
        const result = await saveImage(image, imgDirPath)
        savedName = result.savedName
        const response = await updateUserData(userName, { image: savedName })
        if (response.done) {
            res.status(httpStatus.OK).send(response)
        } else {
            res.status(httpStatus.EXPECTATION_FAILED).send(response)
        }
    }
}