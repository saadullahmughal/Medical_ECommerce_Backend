import { UploadedFile } from "express-fileupload"
import fs, { existsSync } from "fs"
import path from "path"
import { getDownloadUrl, put } from "@vercel/blob"

const dirBaseAddr = "D:/Devminified/Node/Medical_ECommerce_Backend/images/"
const blobBaseAddr = "https://l0exfqlkcyslzqlp.public.blob.vercel-storage.com/"


export const fetchImg = async (imgName: string) => {
    try {
        const imgAddr = blobBaseAddr + imgName
        const url = getDownloadUrl(imgAddr)
        const response = await fetch(url)
        //console.log(response.body)
        if (response && response.ok && !response.body?.locked) {
            const contentType = response.headers.get("content-type") as string
            const data = Buffer.from(await response.arrayBuffer())
            return {
                type: contentType, data: data, url: response.url
            }
        }
        else return null
    } catch (error) {
        console.error(error)
        return null
    }
}

export const saveImage = async (image: UploadedFile) => {
    try {
        if (image.mimetype.indexOf("image/") == 0 && !image.truncated) {
            console.log(image.name)
            const result = await put(image.name, image.data, { access: "public" })
            console.log(result)
            return { originalName: image.name, savedName: path.basename(result.url) }
        }
        else return null
    } catch (error) {
        return null
    }
}