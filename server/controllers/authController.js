import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    try {
    console.log(req)
    console.log(req.body)
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).send({
            success: false,
            message: 'All feilds are required'
        })
    }
    const user = await User.findOne({ email })
    console.log(user)
    if (!user) {
        return res.status(401).send({
            success: false,
            message: 'User do not exist'
        })
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return  res.status(402).send({
            success: false,
            message: 'Email or password incorrect'
        })
    }
    const token = jwt.sign({ _id: user._id, email,username:user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return  res.header('auth-token', token).send(token)
} catch (error) {
    console.log(error)
    return  res.status(500).send({
        success: false,
        message: 'Something went wrong'
    })
    }
}