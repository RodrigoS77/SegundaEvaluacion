import pacientesModel from "../Models/pacientes.js"
import {v2 as Cloudinary} from "cloudinary"
import {config} from "../../config.js"

const pacientesController = {}

pacientesController.getAllPacientes = async(req, res) => {
    try {
        const pacientes = await pacientesModel.find()
        return res.status(200).json(pacientes)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

pacientesController.delelePaciente = async (req, res) => {
    try {
        const pacienteFound = await pacientesModel.findById(req.params.id)

        if (!pacienteFound) {
            return res.status(404).json({message: "Paciente No Encontrado"})
        }

        if (pacienteFound.public_id) {
            await cloudinary.uploader.destroy(pacienteFound.public_id)
        }

        await pacientesModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "Paciente Eliminado Correctamente"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}


pacientesController.updatePaciente = async (req, res) => {
    try {
        const {
            name,
            lastName,
            email,
            password,
            phone,
            address,
            phoneEmergencyContacts,
        } = req.body

        const pacienteFound = await pacientesModel.findById(req.params.id)

        if(!pacienteFound){
            return res.status(404).json({message: "Paciente No Encontrado"})
        }

        const updateDate = {
            name,
            lastName,
            email,
            password,
            phone,
            address,
            phoneEmergencyContacts,
        }

        if (req.file) {
            if (pacienteFound.public_id) {
                await cloudinary.uploader.destroy(pacienteFound.public_id)
            }
            updatedData.profilePhoto = req.file.path;
            updatedData.public_id = req.file.filename
        }

        await pacientesModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true}
        );

        res.status(200).json({message: "Paciente Actualizado Correctamente"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"}) 
    }
}

export default pacientesController