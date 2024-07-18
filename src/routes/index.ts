import express from "express"
import userRoutes from "./user.routes"
import docsRoute from "./docs.routes"
import authRoutes from "./auth.routes"
import fileServerRoutes from "./fileServer.routes"
import userDataFormRoutes from "./userDataForm.routes"
import productRoutes from "./product.routes"
import paymentRoutes from "./payment.routes"

let router = express.Router()

const defaultRoutes = [
    { path: "/User", route: userRoutes },
    { path: "/", route: authRoutes },
    { path: "/img", route: fileServerRoutes },
    { path: "/form", route: userDataFormRoutes },
    { path: "/product", route: productRoutes },
    { path: "/pay", route: paymentRoutes }
]
const devRoutes = [{ path: "/", route: docsRoute }]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

devRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

export default router
