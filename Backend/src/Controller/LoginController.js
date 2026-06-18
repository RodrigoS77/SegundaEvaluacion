import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import pacientModel from "../Models/pacientes.js"
import {config} from "../../config.js"

const LoginController = {} 

LoginController.login = async (req,res) =>{
    try {
        const {email, password} = req.body
        const pacienteFound = await pacientModel.findOne({email})

        if (!pacienteFound) {
            return res.status(404).json({message: "Paciente No Encontrado"})
        }

        if (pacienteFound.timeOut && pacienteFound.timeOut>Date.now()) {
            return res.status(403).json({message: "CUENTA BLOQUEADA"})
        }

        const isMatch = await bcrypt.compare(password, pacienteFound.password)

        if (!isMatch) {
            pacienteFound.loginAttemps = (pacienteFound.loginAttemps || 0) + 1

            if (pacienteFound.loginAttemps >= 5 ) {
                pacienteFound.timeOut = Date.now() + 15 * 60 * 1000
                pacienteFound.loginAttemps = 0

                await pacienteFound.save()
                return res.status(403).json({message: "Cuenta Bloqueada"})
            }
            await pacienteFound.save()
            return res.status(400).json({message: "Contraseña Incorrecta"})
        }

        const token = jsonwebtoken.sign(
            {id:pacienteFound._id, userType: "paciente"},
            config.JWT.secret,
            {expiresIn: "30d"}
        )
        res.cookie("AuthCookie", token)
        return res.status(200).json({message: "Login Exitose"})

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default LoginController