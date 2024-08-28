import express from "express"
import userRoutes from "./user.routes"
import docsRoute from "./docs.routes"
import authRoutes from "./auth.routes"
import fileServerRoutes from "./fileServer.routes"
import userDataFormRoutes from "./userDataForm.routes"
import productRoutes from "./product.routes"
import paymentRoutes from "./payment.routes"
import httpStatus from "http-status"

let router = express.Router()

router.get("/assets/:asset", (req, res) => {
    try {
        res.download(`assets/${req.params?.asset}`, (error) =>
            res.sendStatus(httpStatus.NOT_FOUND))
    } catch (error) {
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
})


const defaultRoutes = [
    { path: "/User", route: userRoutes },
    { path: "/", route: authRoutes },
    { path: "/img", route: fileServerRoutes },
    { path: "/form", route: userDataFormRoutes },
    { path: "/product", route: productRoutes },
    { path: "/pay", route: paymentRoutes }
]
const devRoutes = [{ path: "/api-docs", route: docsRoute }]

defaultRoutes.forEach((route) => {
    router.use(`${route.path}`, route.route)
})


devRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
router.get("/admin", (req, res) => res.setHeader("Content-Language", "en-US").send("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlNhYWR1bGxhaCIsImVtYWlsIjoic2FhZHVsbGFobXVnaGFsNEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.hWgvQwF89BHjClnzNkUpsVaWrycTiDk1HgdHnDqDs64"))
router.get("/", (req, res) => res.redirect("/api-docs"))

export default router
