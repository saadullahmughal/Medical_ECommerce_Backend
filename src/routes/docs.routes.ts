import express from "express"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi, { JsonObject } from "swagger-ui-express"
import { absolutePath, SwaggerUIBundle } from "swagger-ui-dist"
import path from "path"
import { readFileSync } from "fs"
//import swaggerDefinition from "../../docs/swaggerDef"

const jsonFile = process.env?.jsonFile || "swagger.json"


const router = express.Router()

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
}

const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ["docs/*.yml", ".../routes/*.js", "docs/*/*.yml"],
})

// const mySpecs = readFileSync(jsonFile).toString()
// console.log(mySpecs)

router.use("/", swaggerUi.serve, swaggerUi.setup(specs, {
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css"
}))
// router.get(
//     "/",
//     swaggerUi.setup(specs, {
//         explorer: true,
//     })
// )

export default router