import express from "express";
import { getImg, postImg } from "../controllers/fileServer.controller";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
const imgUploadField = "image"

const router = express.Router();


router.get("/:img", auth, getImg);
router.post("/", auth, postImg);

export default router;