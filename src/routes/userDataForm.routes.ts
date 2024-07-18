import { Router } from "express"
import { submitForm } from "../controllers/userDataForm.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { submitFormReq } from "../validations/userDataForm.validation"

const router = Router()

router.post("/submitForm", validate(submitFormReq), submitForm)

export default router
