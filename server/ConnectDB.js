import mongoose from "mongoose";

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database Connected')
    } catch (error) {
        console.log(error)
    }
}

export default ConnectDB