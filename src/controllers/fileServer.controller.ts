import express from "express"
import httpStatus from "http-status"
import { fetchImg, saveImage } from "../services/fileServer.service"
import { FileArray, UploadedFile } from "express-fileupload"
import { configDotenv } from "dotenv"
configDotenv()


const dirBaseAddr = "images/"

export const getImg = async (req: express.Request, res: express.Response) => {
    const imgName = req.params?.img
    const img = await fetchImg(imgName)
    //console.log(img?.type)
    if (!img) res.sendStatus(httpStatus.NOT_FOUND)
    else {
        //console.log(img.data.byteLength)
        res.status(httpStatus.OK).contentType(img.type).end(img.data)
    }
}

export const postImg = async (req: express.Request, res: express.Response) => {
    const files = req.files as FileArray
    const images = files?.images
    let savedAddr: [Record<string, any>] = [{}]
    savedAddr.pop()
    if (!images) res.sendStatus(httpStatus.BAD_REQUEST)
    else
        try {
            if (Object.keys(images).some((element => element == "name"))) {
                const image = images as UploadedFile
                const result = await saveImage(image)
                if (result) savedAddr.push(result)
            } else {
                const imageArray = images as UploadedFile[]
                const promises = imageArray.map((image) => saveImage(image))
                Promise.all(promises)
                promises.forEach((element) => { if (element) savedAddr.push(element) })
            }
            res.status(httpStatus.OK).send(savedAddr)
        } catch (error) {
            console.error(error)
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
}
