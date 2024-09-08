"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
//import swaggerDefinition from "../../docs/swaggerDef"
const jsonFile = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.jsonFile) || "swagger.json";
const router = express_1.default.Router();
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
            url: `https://medical-e-commerce-backend.vercel.app/`,
        },
    ],
};
const specs = (0, swagger_jsdoc_1.default)({
    swaggerDefinition,
    apis: ["docs/*.yml", ".../routes/*.js", "docs/*/*.yml"],
});
// const mySpecs = readFileSync(jsonFile).toString()
// console.log(mySpecs)
router.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css"
}));
// router.get(
//     "/",
//     swaggerUi.setup(specs, {
//         explorer: true,
//     })
// )
exports.default = router;
