import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
//import swaggerDefinition from "../../docs/swaggerDef";

const router = express.Router();

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
            url: `http://localhost:5000`,
        },
    ],
};

const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ["docs/*.yml", ".../routes/*.js", "docs/*/*.yml"],
});

router.use("/", swaggerUi.serve, swaggerUi.setup(specs));
// router.get(
//     "/",
//     swaggerUi.setup(specs, {
//         explorer: true,
//     })
// );

export default router;