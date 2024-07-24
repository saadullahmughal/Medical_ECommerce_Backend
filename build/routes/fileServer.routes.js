"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileServer_controller_1 = require("../controllers/fileServer.controller");
const auth_1 = require("../middlewares/auth");
const imgUploadField = "image";
const router = express_1.default.Router();
router.get("/:img", (0, auth_1.auth)(), fileServer_controller_1.getImg);
router.post("/", (0, auth_1.auth)("admin"), fileServer_controller_1.postImg);
exports.default = router;
