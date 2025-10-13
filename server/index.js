import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import ConnectDB from './ConnectDB.js'
import userRoutes from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { authentication } from './middlewares/authentication.js'
import { requestLogger } from './middlewares/requestLogger.js'


const app = express()

dotenv.config()
ConnectDB()

// app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: '*',
}))

app.use('/dashboard', authentication, dashboardRoutes)
app.use('/', userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Connected on Port ${process.env.PORT}`)
})







