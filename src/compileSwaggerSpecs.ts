import swaggerJSDoc from "swagger-jsdoc"
import { writeFileSync } from "fs"

const jsonFile = process.env?.jsonFile || "swagger.json"

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
}

const specs = swaggerJSDoc({
    swaggerDefinition,
    apis: ["docs/*.yml", ".../routes/*.js", "docs/*/*.yml"],
})

const json = JSON.stringify(specs)

writeFileSync(jsonFile, json)