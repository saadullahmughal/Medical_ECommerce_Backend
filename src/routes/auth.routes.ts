import express from "express"
import { signUp, logIn, logOut, forgotPassword, resetPassword, refreshToken, changePasswordOrEmail } from "../controllers/auth.controller"
import { auth, authIgnoringExpiry } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { addUserReqBody, forgotPasswordReqBody, logInReqBody, logOutReqBody, refreshTokenReqBody, resetPasswordReqBody, signUpReqBody } from "../validations/auth.validation"
import { changePasswordOrEmailReqBody } from "../validations/user.validation"

const router = express.Router()

router.post("/signUp", validate(signUpReqBody), signUp)

router.post("/logIn", validate(logInReqBody), logIn)

router.post("/logOut", auth(), validate(logOutReqBody), logOut)

router.post("/forgotPassword", validate(forgotPasswordReqBody), forgotPassword)
router.post("/resetPassword", validate(resetPasswordReqBody), resetPassword)
router.post("/refreshToken", authIgnoringExpiry(), validate(refreshTokenReqBody), refreshToken)
router.patch("/modifyAuth", auth(), validate(changePasswordOrEmailReqBody), changePasswordOrEmail)


router.post("/addUser", auth("admin"), validate(addUserReqBody), signUp)

export default router