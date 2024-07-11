import fs from "fs";

const dirBaseAddr = "D:/Devminified/Node/Medical_ECommerce_Backend/images/";


export const getImgAddress = (img: string) => {
    const imgAddr = dirBaseAddr + img;
    if (!fs.existsSync(imgAddr)) return null;
    else return imgAddr;
};

export const saveImg = (imgName: string, encodedImg: string) => {
    if (fs.existsSync(dirBaseAddr + imgName)) return null;
    const image = Buffer.from(encodedImg, "base64");
    fs.writeFileSync(dirBaseAddr + imgName, image);
    return true;
}