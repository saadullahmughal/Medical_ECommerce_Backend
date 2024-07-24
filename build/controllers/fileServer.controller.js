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
exports.postImg = exports.getImg = void 0;
const http_status_1 = __importDefault(require("http-status"));
const fileServer_service_1 = require("../services/fileServer.service");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const dirBaseAddr = "images/";
const getImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imgName = (_a = req.params) === null || _a === void 0 ? void 0 : _a.img;
    const img = yield (0, fileServer_service_1.fetchImg)(imgName);
    //console.log(img?.type)
    if (!img)
        res.sendStatus(http_status_1.default.NOT_FOUND);
    else {
        //console.log(img.data.byteLength)
        res.status(http_status_1.default.OK).contentType(img.type).end(img.data);
    }
});
exports.getImg = getImg;
const postImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const images = files === null || files === void 0 ? void 0 : files.images;
    let savedAddr = [{}];
    savedAddr.pop();
    if (!images)
        res.sendStatus(http_status_1.default.BAD_REQUEST);
    else
        try {
            if (Object.keys(images).some((element => element == "name"))) {
                const image = images;
                const result = yield (0, fileServer_service_1.saveImage)(image);
                if (result)
                    savedAddr.push(result);
            }
            else {
                const imageArray = images;
                const promises = imageArray.map((image) => (0, fileServer_service_1.saveImage)(image));
                Promise.all(promises);
                promises.forEach((element) => { if (element)
                    savedAddr.push(element); });
            }
            res.status(http_status_1.default.OK).send(savedAddr);
        }
        catch (error) {
            console.error(error);
            res.sendStatus(http_status_1.default.INTERNAL_SERVER_ERROR);
        }
});
exports.postImg = postImg;
