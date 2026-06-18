import express from "express"
import LogOutController from "../Controller/LogOutController.js"

const router = express.Router();

router.route("/").post(LogOutController.logOut)

export default router