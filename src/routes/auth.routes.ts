import express from "express";
import { signUp, logIn, logOut, forgotPassword, resetPassword, refreshToken } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { forgotPasswordReqBody, logInReqBody, logOutReqBody, refreshTokenReqBody, resetPasswordReqBody, signUpReqBody } from "../validations/auth.validation";

const router = express.Router();

router.post("/signUp", validate(signUpReqBody), signUp);

router.post("/logIn", validate(logInReqBody), logIn);

router.post("/logOut", auth, validate(logOutReqBody), logOut);

router.post("/forgotPassword", validate(forgotPasswordReqBody), forgotPassword);
router.post("/resetPassword", validate(resetPasswordReqBody), resetPassword);
router.post("/refreshToken", validate(refreshTokenReqBody), refreshToken);

export default router;