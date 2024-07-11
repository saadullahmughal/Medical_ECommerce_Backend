import { Router } from "express";
import { submitForm } from "../controllers/userDataForm.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/submitForm", submitForm);

export default router;
