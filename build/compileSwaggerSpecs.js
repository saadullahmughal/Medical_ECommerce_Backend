"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const fs_1 = require("fs");
const jsonFile = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.jsonFile) || "swagger.json";
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Medical E-Commerce",
        description: "Medical E-commerce system using Mongo, Node & Express",
        version: "1.0.0",
        author: "Saadullah",
        contact: {
            //name: "Saadullah",
            email: "saadullahmughal4@gmail.com",
        },
    },
    servers: [
        {
            description: "Main API Endpoint",
            url: `localhost:3000/`,
        },
    ],
};
const specs = (0, swagger_jsdoc_1.default)({
    swaggerDefinition,
    apis: ["docs/*.yml", ".../routes/*.js", "docs/*/*.yml"],
});
const json = JSON.stringify(specs);
(0, fs_1.writeFileSync)(jsonFile, json);
