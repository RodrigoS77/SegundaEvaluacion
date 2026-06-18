import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import pacienteModel from "../Models/pacientes.js"
import {config} from "../../config.js"

const registerPacientesController ={}

registerPacientesController.registerPaciente = async (req, res) => {
    const {
        name,
        lastName,
        email,
        password,
        phone,
        address,
        phoneEmergencyContacts,
        isVerified,
        loginAttemps,
        timeOut
    } = req.body;

    try {
        const existPaciente = await pacienteModel.findOne({email})
        if (existPaciente) {
            return res.status(400).json({message :"El Correo ya esta registrado" })
        }

        const passwordHash = await bcryptjs.hash(password, 10)

        const VerificationCode = crypto.randomBytes(3).toString("hex")

        const tokenCode = jsonwebtoken.sign(
            {
                name,
                lastName,
                email,
                password: passwordHash,
                phone,
                address,
                phoneEmergencyContacts,
                isVerified,
                loginAttemps,
                timeOut,
                profilePhoto: req.file?.path,
                public_id: req.file?.filename
            },
            config.JWT.secret,
            {expiresIn: "15m" }
        );

        res.cookie("VerificationCode", tokenCode,{
            maxAge:15*60*1000
        })
        const transport = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        const mailOptions = {
            from: config.email.user_email,
            to:email,
            subject: "Codigo De Verificacion",
            text: "Para verificar tu cuenta utiliza este codigo: " + VerificationCode + " .Expira En 15 Minutos"
        }

        transport.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error)
                return res.status(500).json({message: "Error Al Enviar El Correo"})
            }

            return res.status(200).json({message: "Paciente Registrado, Verifica Tu Correo Electronico"})
        })
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

registerPacientesController.verifyCode = async(req, res) =>{
    try {

        const token = req.cookies.VerificationCode
        
        const decoded = jsonwebtoken.verify(
            token,
            config.JWT.secret
        )

        const {
            name,
            lastName,
            email,
            password,
            phone,
            address,
            phoneEmergencyContacts,
            profilePhoto,
            public_id,
            VerificationCode: storedCode,
            loginAttemps,
            timeOut,
        } = decoded


        const newPaciente = new pacienteModel({
            name,
            lastName,
            email,
            password,
            phone,
            address,
            phoneEmergencyContacts,
            isVerified: true,
            loginAttemps,
            timeOut,
            profilePhoto,
            public_id
        })
        await newPaciente.save()

        res.clearCookie("VerificationToken")

        return res.status(200).json({message: "Cuenta Verificada Correctamente"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default registerPacientesController