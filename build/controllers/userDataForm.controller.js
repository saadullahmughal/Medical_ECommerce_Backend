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
exports.submitForm = void 0;
const http_status_1 = __importDefault(require("http-status"));
const userDataForm_service_1 = require("../services/userDataForm.service");
const submitForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    if (!formData)
        res.status(http_status_1.default.EXPECTATION_FAILED).send();
    const response = yield (0, userDataForm_service_1.submitFormService)(formData);
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.OK).send(response);
});
exports.submitForm = submitForm;
