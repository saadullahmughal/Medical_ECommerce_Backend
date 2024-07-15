import { Router } from "express";
import { addProfilePic, getUser, updateUser } from "../controllers/user.controller";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { addProfilePicReq, updateUserReqBody } from "../validations/user.validation";

const router = Router();

router.get("/", auth(), getUser);
router.put("/", auth(), validate(updateUserReqBody), updateUser)
router.post("/", auth(), validate(addProfilePicReq), addProfilePic)


export default router;