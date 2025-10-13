import mongoose from "mongoose";

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database Connected')
    } catch (error) {
        console.error(error)
    }
}

export default ConnectDB