import express from "express"
import RecuperarContraseñaController from "../Controller/RecuperarContraseñaController.js"

const router = express.Router();

router.route("/requestCode").post(RecuperarContraseñaController.requestCode)
router.route("/verifyCode").post(RecuperarContraseñaController.verifyCode)
router.route("/newPassword").post(RecuperarContraseñaController.newPassword)

export default router