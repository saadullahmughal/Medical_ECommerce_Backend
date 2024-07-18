import mongoose from "mongoose"

const formSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    referrer: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    showGender: { type: Boolean },
    location: { type: String },
    diagnosis: { type: Boolean },
    indicators: { type: String },
    subtype: { type: String },
    startTime: { type: Date },
})

const FormData = mongoose.model("userData", formSchema)

export default FormData
