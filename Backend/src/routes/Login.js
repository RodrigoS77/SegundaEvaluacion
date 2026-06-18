import express from "express"
import LoginController from "../Controller/LoginController.js"

const router = express.Router()

router.route("/").post(LoginController.login)

export default router