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
        console.error('Error in Authorization ' + error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong'
        })
    }
}

export const authorizeBase = async (req, res, next) => {
    try {
        const { role, baseId, base_id, email } = req.user
        if (role && role !== 'AD') {
            const { id } = req.params
            if (id !== baseId) {
                return res.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                })
            }
            
            let query = role === 'COM'?'baseComm': 'lgstcOff' 
            
            const baseInfo = await Base.findOne({ baseId: id }).select(query)
            if (baseInfo._id.toString() !== base_id) {
                return res.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                })
            }
            if (baseInfo[query] !== email) {
                return res.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                })
            }
        }
        next()
    } catch (error) {
        console.error('Error in Authorization ' + error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong'
        })
    }
}
