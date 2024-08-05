"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProfilePic = exports.updateUser = exports.getUser = void 0;
const user_service_1 = require("../services/user.service");
const http_status_1 = __importStar(require("http-status"));
const auth_1 = require("../middlewares/auth");
const fileServer_service_1 = require("../services/fileServer.service");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, user_service_1.getUserData)(userName);
    if (!response.done) {
        res.status(http_status_1.EXPECTATION_FAILED).send(response);
    }
    else {
        res.status(http_status_1.OK).send(response);
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const userData = req.body;
    const response = yield (0, user_service_1.updateUserData)(userName, userData);
    if (response.done) {
        res.status(http_status_1.CREATED).send(Object.assign(Object.assign({}, response), { message: "Data updated" }));
    }
    else {
        res.status(http_status_1.EXPECTATION_FAILED).send(response);
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
                res.status(http_status_1.default.EXPECTATION_FAILED).send({ done: false, message: "No valid profile image uploaded" });
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
