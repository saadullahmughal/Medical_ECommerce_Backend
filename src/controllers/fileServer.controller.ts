import express from "express";
import httpStatus from "http-status";
import { getImgAddress, saveImage } from "../services/fileServer.service";
import path from "path";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";
import { configDotenv } from "dotenv";
import { number } from "joi";
import { existsSync } from "fs";
configDotenv();


const dirBaseAddr = "images/";

export const getImg = async (req: express.Request, res: express.Response) => {
    const imgName = req.params?.img;
    const imgAddr = getImgAddress(imgName);
    if (!imgAddr) res.status(httpStatus.NOT_FOUND).send();
    else res.status(httpStatus.OK).sendFile(imgAddr);
};

export const postImg = async (req: express.Request, res: express.Response) => {
    const files = req.files as FileArray
    const images = files?.image
    let savedAddr: [Record<string, any>] = [{}]
    savedAddr.pop()
    if (!images) res.sendStatus(httpStatus.BAD_REQUEST)
    else
        try {
            const imgDirPath = "images"
            if (Object.keys(images).some((element => element == "name"))) {
                const image = images as UploadedFile
                savedAddr.push(await saveImage(image, imgDirPath))
            } else {
                const imageArray = images as UploadedFile[]
                const promises = imageArray.map((image) => saveImage(image, imgDirPath))
                savedAddr.push(...await Promise.all(promises))
            }
            res.status(httpStatus.OK).send(savedAddr);
        } catch (error) {
            console.error(error)
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
};
