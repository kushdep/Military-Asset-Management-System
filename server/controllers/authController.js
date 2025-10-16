import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Base from '../models/base.js'
import logTransaction from "../transactionLogger.js"

export const login = async (req, res) => {
    try {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).send({
            success: false,
            message: 'All feilds are required'
        })
    }
    const user = await User.findOne({ email })
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

    let query={}
    if(user.role==='COM'){
        query['baseComm'] = email
    }else if(user.role==='LGOF'){
        query['lgstcOff'] = email
    }
    
    const baseInfo = await Base.findOne(query).select('_id baseId')
    
    let tokenPayload = { _id: user._id, email,username:user.username,role:user.role }
    
    
    if(user.role!=='AD'){
        tokenPayload['baseId'] = baseInfo.baseId.toString()
        tokenPayload['base_id'] = baseInfo._id.toString()
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' })
    logTransaction('Login Successfull',`${user.username} role-${user.role}`,new Date().toISOString())
    return  res.header('auth-token', token).send({token,role:user.role,name:user.username,baseInfo})
} catch (error) {
    console.error(error)
    return  res.status(500).send({
        success: false,
        message: 'Something went wrong'
    })
    }
}