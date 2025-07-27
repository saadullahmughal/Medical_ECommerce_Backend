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
exports.addProfilePic = exports.updateUser = exports.getUser = void 0;
const user_service_1 = require("../services/user.service");
const http_status_1 = __importDefault(require("http-status"));
const auth_1 = require("../middlewares/auth");
const fileServer_service_1 = require("../services/fileServer.service");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, user_service_1.getUserData)(userName);
    if (!response.done) {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
    else {
        res.status(http_status_1.default.OK).send(response);
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const userData = req.body;
    const response = yield (0, user_service_1.updateUserData)(userName, userData);
    if (response.done) {
        res
            .status(http_status_1.default.CREATED)
            .send(Object.assign(Object.assign({}, response), { message: "Data updated" }));
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.updateUser = updateUser;
const addProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
        const image = (_b = req.files) === null || _b === void 0 ? void 0 : _b.image;
        let savedName = "";
        if (!image)
            res.status(http_status_1.default.BAD_REQUEST).send("No profile image uploaded");
        else {
            const result = yield (0, fileServer_service_1.saveImage)(image);
            if (!result) {
                res
                    .status(http_status_1.default.EXPECTATION_FAILED)
                    .send({ done: false, message: "No valid profile image uploaded" });
                return;
            }
            savedName = result.savedName;
            const response = yield (0, user_service_1.updateUserData)(userName, { image: savedName });
            if (response.done) {
                res.status(http_status_1.default.CREATED).send(response);
            }
            else {
                res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(http_status_1.default.EXPECTATION_FAILED).send(error);
    }
});
exports.addProfilePic = addProfilePic;
