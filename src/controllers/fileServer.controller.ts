import express from "express"
import httpStatus from "http-status"
import { getImgAddress, saveImage } from "../services/fileServer.service"
import path from "path"
import fileUpload, { FileArray, UploadedFile } from "express-fileupload"
import { configDotenv } from "dotenv"
import { number } from "joi"
import { existsSync } from "fs"
configDotenv()


const dirBaseAddr = "images/"

export const getImg = async (req: express.Request, res: express.Response) => {
    const imgName = req.params?.img
    const imgAddr = getImgAddress(imgName)
    if (!imgAddr) res.sendStatus(httpStatus.NOT_FOUND)
    else res.status(httpStatus.OK).sendFile(imgAddr)
}

export const postImg = async (req: express.Request, res: express.Response) => {
    const files = req.files as FileArray
    const images = files?.images
    let savedAddr: [Record<string, any>] = [{}]
    savedAddr.pop()
    if (!images) res.sendStatus(httpStatus.BAD_REQUEST)
    else
        try {
            const imgDirPath = "images"
            if (Object.keys(images).some((element => element == "name"))) {
                const image = images as UploadedFile
                const result = await saveImage(image, imgDirPath)
                if (result) savedAddr.push(result)
            } else {
                const imageArray = images as UploadedFile[]
                const promises = imageArray.map((image) => saveImage(image, imgDirPath))
                Promise.all(promises)
                promises.forEach((element) => { if (element) savedAddr.push(element) })
            }
            res.status(httpStatus.OK).send(savedAddr)
        } catch (error) {
            console.error(error)
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
}
