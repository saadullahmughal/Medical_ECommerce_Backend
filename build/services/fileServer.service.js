"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveImage = exports.fetchImg = void 0;
const path_1 = __importDefault(require("path"));
const blob_1 = require("@vercel/blob");
const dirBaseAddr = "D:/Devminified/Node/Medical_ECommerce_Backend/images/";
const blobBaseAddr = "https://l0exfqlkcyslzqlp.public.blob.vercel-storage.com/";
const fetchImg = (imgName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const imgAddr = blobBaseAddr + imgName;
        const url = (0, blob_1.getDownloadUrl)(imgAddr);
        const response = yield fetch(url);
        //console.log(response.body)
        if (response && response.ok && !((_a = response.body) === null || _a === void 0 ? void 0 : _a.locked)) {
            const contentType = response.headers.get("content-type");
            const data = Buffer.from(yield response.arrayBuffer());
            return {
                type: contentType, data: data, url: response.url
            };
        }
        else
            return null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.fetchImg = fetchImg;
const saveImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (image.mimetype.indexOf("image/") == 0 && !image.truncated) {
            console.log(image.name);
            const result = yield (0, blob_1.put)(image.name, image.data, { access: "public", token: process.env.IMAGE_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN });
            console.log(result);
            return { originalName: image.name, savedName: path_1.default.basename(result.url) };
        }
        else
            return null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.saveImage = saveImage;
