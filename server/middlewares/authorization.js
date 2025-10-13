import Base from "../models/base.js"

export const authorize = async (req, res, next) => {
    try {
        const { role } = req.user
        if (role === 'COMM') {
            return res.status(403).send({
                success: false,
                message: 'Permission Denied'
            })
        }
        next()
    } catch (error) {
        console.log('Error in Authorization ' + error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong'
        })
    }
}

export const authorizeBase = async (req, res, next) => {
    try {
        const { role, baseId, base_id, email } = req.user
        console.log("base middleware")
        if (role !== 'AD') {
            const { id } = req.params
            if (id !== baseId) {
                return res.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                })
            }
            
            let query = role === 'COM'?'baseComm': 'lgstcOff' 
            console.log(query)
            
            const baseInfo = await Base.findOne({ baseId: id }).select(query)
            console.log(baseInfo)
            console.log(base_id)
            if (baseInfo._id.toString() !== base_id) {
                return res.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                })
            }
            console.log(baseInfo[query])
            if (baseInfo[query] !== email) {
                return res.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                })
            }
        }
        next()
    } catch (error) {
        console.log('Error in Authorization ' + error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong'
        })
    }
}
