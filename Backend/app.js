import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import PacientesRoutes from "./src/routes/pacientes.js" 
import registerPacientesRoutes from "./src/routes/RegisterPacientes.js"
import LoginRoutes from "./src/routes/Login.js"
import LogOut from "./src/routes/LogOut.js"
import RecuperarContraseña from "./src/routes/RecuperarContraseña.js"

const app = express();

app.use(
    cors({
        origin:["http://localhost:5173", "http://localhost:5174"],
        credentials:true
    })
);

app.use(cookieParser());
app.use(express.json());

//ENDPOINTS
app.use("/api/pacientes", PacientesRoutes)
app.use("/api/registerPaciente", registerPacientesRoutes)
app.use("/api/Login",LoginRoutes)
app.use("/api/LogOut", LogOut)
app.use("/api/RecuperarContrasena", RecuperarContraseña)

export default app;