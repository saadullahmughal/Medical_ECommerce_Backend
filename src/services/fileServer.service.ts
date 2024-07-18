import { UploadedFile } from "express-fileupload"
import fs, { existsSync } from "fs"
import path from "path"

const dirBaseAddr = "D:/Devminified/Node/Medical_ECommerce_Backend/images/"


export const getImgAddress = (img: string) => {
    const imgAddr = dirBaseAddr + img
    if (!fs.existsSync(imgAddr)) return null
    else return imgAddr
}


export const saveImage = async (image: UploadedFile, dirPath: string) => {
    const imgPath = path.join(dirPath)
    let filePath
    if (image.mimetype.indexOf("image/") == 0 && !image.truncated) {
        console.log(image.name)
        const fileName = Date.now().toString()
        const fileExt = image.name.substring(image.name.lastIndexOf("."))
        filePath = path.join(dirPath, fileName + fileExt)
        let ind = 0
        while (existsSync(filePath)) {
            filePath = path.join(dirPath, fileName + ind + fileExt)
        }
        await image.mv(filePath)
        return { originalName: image.name, savedName: path.basename(filePath as string) }
    } else return null
}