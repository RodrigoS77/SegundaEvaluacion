import express from "express"
import ControllerPacientes from "../Controller/pacientesController.js"
import upload from "../utils/CloudinaryConfig.js"
import pacientesController from "../Controller/pacientesController.js";

const router = express.Router();

router.route("/")
.get(ControllerPacientes.getAllPacientes)

router.route("/:id")
.put(upload.single("profilePhoto"), pacientesController.updatePaciente)
.delete(pacientesController.delelePaciente)

export default router