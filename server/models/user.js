import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    base: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum:['AD','LGOF','COM']
    },
}, { timestamps: true })


const User = mongoose.model('User', userSchema)
export default User

