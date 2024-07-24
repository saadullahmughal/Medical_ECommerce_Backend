"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const http_status_1 = __importDefault(require("http-status"));
const validate = (schema) => (req, res, next) => {
    try {
        const schemaObject = joi_1.default.compile(schema);
        const validationResults = schemaObject.validate(req, { allowUnknown: true });
        if (validationResults.error)
            throw validationResults.error;
        next();
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).send(error === null || error === void 0 ? void 0 : error.toString());
        return;
    }
};
exports.validate = validate;
