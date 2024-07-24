import { Router } from "express"
import { addProfilePic, getUser, updateUser } from "../controllers/user.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { addProfilePicReq, updateUserReqBody } from "../validations/user.validation"
import { verifyMongoConnection } from "../middlewares/checkConnection"

const router = Router()

router.get("/", auth(), verifyMongoConnection, getUser)
router.put("/", auth(), validate(updateUserReqBody), verifyMongoConnection, updateUser)
router.post("/", auth(), verifyMongoConnection, addProfilePic)


export default router