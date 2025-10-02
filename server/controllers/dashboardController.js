import Base from "../models/base.js"

export const getALLBaseData = async (req, res) => {
    try {
        let result = []
        result = await Base.find().select('baseId baseName')
        console.log(result)
        if (result.length === 0) {
            return res.status(204).send({
                success: false,
                totalLocs: 0,
                message: "No Base Locations Data"
            })
        }
        return res.status(200).send({
            success: true,
            totalLocs: result.length,
            data: result,
            message: "Found Base Location Ids"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: error
        })
    }
}


export const getIdvlBaseData = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const { role, email } = req.user
        console.log(role)
        console.log(email)
        const baseDoc = await Base.findOne({ baseId: id }).populate([{ path: 'purchase', populate: { path: 'items.asset' } }, { path: 'inventory.Vehicle' }, { path: 'inventory.Weapons' }, { path: 'inventory.Ammunition' }])
        console.log(baseDoc)
        if (baseDoc === null) {
            return res.status(400).send({
                success: false,
                message: 'Base Not Found'
            })
        }
        if (role === 'COM' || role === 'LGF') {
            let val = (role === "COM") ? "baseComm" : "balgstcOff";
            if (baseDoc.val !== email) {
                return res.status(403).send({
                    success: false,
                    message: 'Unauthorized Access'
                })
            }
        }
        return res.status(200).send({
            success: true,
            data: baseDoc,
            message: 'Base Details Found'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: error
        })
    }
}