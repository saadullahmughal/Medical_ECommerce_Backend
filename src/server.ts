import express from "express"
import routes from "./routes"
import httpStatus from "http-status"
import cookie_parser from "cookie-parser"
import fileUpload from "express-fileupload"

const app: express.Application = express()

app.use(express.json())
app.use(cookie_parser())
app.use(fileUpload())
app.use(routes)

app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND).send("Not Found")
})

export default app
