import Base from "../models/base.js"

export const getALLBaseData = async (req, res) => {
    try {
        let result = []
        result = await Base.find()
        console.log(result)
        result = await Base.find().select('baseNo baseName')
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
            data:result,
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


export const getIndBaseData = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: error
        })
    }
}