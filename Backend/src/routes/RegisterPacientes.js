import express from "express"
import registerPacientesController from "../Controller/registerPacientesController.js"
import upload from "../utils/CloudinaryConfig.js"

const router = express.Router()

router.route("/").post(upload.single("profilePhoto"), registerPacientesController.registerPaciente)
router.route("/verifyCodeEmail").post(registerPacientesController.verifyCode)

export default router