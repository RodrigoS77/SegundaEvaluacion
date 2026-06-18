import multer from "multer"
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import {config} from "../../config.js"

cloudinary.config({
    cloud_name:config.cloudinary.cloudinary_name,
    api_key:config.cloudinary.cloudinary_api_key,
    api_secret:config.cloudinary.cloudinary_api_secret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "SegundaEvaluacion",
        allowed_formarts: ["jpg", "png", "jpeg", "pdf"]
    }
})

const upload = multer({storage})

export default upload