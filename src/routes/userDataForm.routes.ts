import { Router } from "express"
import { submitForm } from "../controllers/userDataForm.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { submitFormReq } from "../validations/userDataForm.validation"
import { verifyMongoConnection } from "../middlewares/checkConnection"

const router = Router()

router.post("/submitForm", validate(submitFormReq), verifyMongoConnection, submitForm)

export default router
