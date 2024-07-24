"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
const swaggerDef = {
    openapi: "3.0.0",
    info: {
        title: "ManageUsers",
        description: "User Management system using Mongo, Node & Express",
        version: package_json_1.version,
        author: "Saadullah",
        contact: {
            //name: "Saadullah",
            email: "saadullahmughal4@gmail.com",
        },
    },
    servers: [
        {
            description: "Main API Endpoint",
            url: `http://localhost:5000`,
        },
    ],
};
exports.default = swaggerDef;
