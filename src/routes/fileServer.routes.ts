import express from "express";
import { getImg, postImg } from "../controllers/fileServer.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/:img", getImg);
router.post("/", auth("admin"), postImg);

export default router;
