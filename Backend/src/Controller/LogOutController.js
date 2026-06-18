const LogOutController = {}

LogOutController.logOut = (req,res) => {
    try {
        res.clearCookie("AuthCookie")
        return res.status(200).json({message:"Sesion Cerrada"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default LogOutController