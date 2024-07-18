import { version } from "../../package.json"

const swaggerDef = {
    openapi: "3.0.0",
    info: {
        title: "ManageUsers",
        description: "User Management system using Mongo, Node & Express",
        version,
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
}

export default swaggerDef
