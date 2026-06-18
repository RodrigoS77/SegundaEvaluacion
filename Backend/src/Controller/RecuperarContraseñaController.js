import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import nodemailer from "nodemailer"
import {config} from "../../config.js"
import PacienteModel from "../Models/pacientes.js"

const RecuperarContraseñaController = {}

RecuperarContraseñaController.requestCode = async (req,res) =>{
    try {
        const {email} = req.body
        const pacienteFound = await PacienteModel.findOne({email})

        if (!pacienteFound) {
            return res.json({message: "Paciente No Encontrado"})
        }
        const code = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign(
            {email,code, userType: "Paciente", verified: false},
            config.JWT.secret,
            {expiresIn: "15m"}
        )
        res.cookie("recoveryCookie", token, {maxAge: 15 * 60 *1000})

        const transport = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:config.email.user_email,
                pass:config.email.user_password
            }
        })

        const mailOptions ={
            from: config.email.user_email,
            to: email,
            subject: "Correo de recuperacion",
            text: "Usa Este codigo para recuperar tu cuenta",
            html: `<p> Usa este codigo para recuperar tu cuenta: 
                <strong>${code}</strong></p> `
        }

        transport.sendMail(mailOptions, (error, info) =>{
            if (error) {
                console.log("error" + error)
                return res.status(500).json({message: "Error al enviar el correo"})
            }
            return res.status(200).json({message: "Correo Enviado"})
        })
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

RecuperarContraseñaController.verifyCode = async (req,res) =>{
    try {
        const {codeRequest} = req.body
        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token,config.JWT.secret)

        if (codeRequest !== decoded.code) {
            return res.status(400).json({message: "Invalid Code"})
        }

        const newToken = jsonwebtoken.sign(
            {email: decoded.email, userType: "Paciente", verified:true},
            config.JWT.secret,
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", newToken, {maxAge:15*60*1000})
        return res.status(200).json({message: "Codigo Verificado Correctamente"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

RecuperarContraseñaController.newPassword = async (req,res) => {
    try {
        const {newPassword, confirmNewPassword} = req.body

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({message: "Las contraseñas No coinciden"})
        }

        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token,config.JWT.secret)

        if(!decoded.verified){
            return res.status(400).json({message: "Codigo No Verificado"})
        }

        const passwordHash = await bcrypt.hash(newPassword, 10)

        await PacienteModel.findOneAndUpdate(
            {email:decoded.email},
            {password: passwordHash},
            {new: true}
        )
        res.clearCookie("recoveryCookie")
        return res.status(200).json({message: "Contraseña Actualizada"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default RecuperarContraseñaController