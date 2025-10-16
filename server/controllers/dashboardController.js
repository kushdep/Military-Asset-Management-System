import Base from "../models/base.js"
import logTransaction from "../transactionLogger.js"

export const getALLBaseIds = async (req, res) => {
  try {
    let result = []
    const {username,role}=req.user
    result = await Base.find().select('_id baseId baseName')

    logTransaction(false,'Req for Base Ids ', `${username} role-${role}`,{idsLength:result.length})
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
    console.error(error)
    return res.status(500).send({
      success: false,
      message: error
    })
  }
}

export const getIdvlBaseData = async (req, res) => {
  try {
    const { id } = req.params
    const {username,role} = req.user

    const baseDoc = await Base.findOne({ baseId: id }).populate([{ path: 'purchase', populate: { path: 'items.asset' } }, { path: 'inventory.Vehicle.asset' }, { path: 'inventory.Weapons.asset' }, { path: 'inventory.Ammunition.asset' }, { path: 'asgnAst' }, { path: 'tsfrAst.IN' }, { path: 'tsfrAst.OUT' }])
    
    if (baseDoc === null) {
      logTransaction(true,'Base Not found ', `${username} role-${role}`,{baseId:id})
      return res.status(400).send({
        success: false,
        message: 'Base Not Found'
      })
    }

    logTransaction(false,'Req for Base Data ', `${username} role-${role}`,{baseId:id})
    return res.status(200).send({
      success: true,
      data: baseDoc,
      message: 'Base Details Found'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      success: false,
      message: error
    })
  }
}

