import { Router } from "express";
import { changePasswordOrEmail, getUser, updateUser } from "../controllers/user.controller";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { changePasswordOrEmailReqBody, updateUserReqBody } from "../validations/user.validation";

const router = Router();

router.get("/", auth, getUser);
router.put("/", auth, validate(updateUserReqBody), updateUser)
router.patch("/", auth, validate(changePasswordOrEmailReqBody), changePasswordOrEmail)


export default router;