import express from "express";
import httpStatus from "http-status";
import { getImgAddress, saveImg } from "../services/fileServer.service";
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
    if (!images) res.sendStatus(httpStatus.BAD_REQUEST)
    else
        try {
            const imgDirPath = "images"
            if (Object.keys(images).some((element => element == "name"))) {
                const image = images as UploadedFile
                await saveImage(image, imgDirPath)
            } else {
                const imageArray = images as UploadedFile[]
                const promises = imageArray.map((image) => saveImage(image, imgDirPath))
                await Promise.all(promises)
            }
            res.sendStatus(httpStatus.OK);
        } catch (error) {
            console.error(error)
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
};

const saveImage = async (image: UploadedFile, dirPath: string) => {
    const imgPath = path.join(dirPath);
    if (image.mimetype.indexOf("image/") == 0 && !image.truncated) {
        console.log(image.name)
        const fileName = Date.now().toString()
        const fileExt = image.name.substring(image.name.lastIndexOf("."))
        let filePath = path.join(dirPath, fileName + fileExt)
        let ind = 0
        while (existsSync(filePath)) {
            filePath = path.join(dirPath, fileName + ind + fileExt)
        }
        await image.mv(filePath);
    }
}