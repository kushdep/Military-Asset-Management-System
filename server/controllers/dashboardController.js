import Base from "../models/base.js"

export const getALLBaseIds = async (req, res) => {
  try {
    let result = []
    result = await Base.find().select('_id baseId baseName')
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
    console.log(req.params)
    const { id } = req.params
    console.log("getting base data"+id)

    const baseDoc = await Base.findOne({ baseId: id }).populate([{ path: 'purchase', populate: { path: 'items.asset' } }, { path: 'inventory.Vehicle.asset' }, { path: 'inventory.Weapons.asset' }, { path: 'inventory.Ammunition.asset' }, { path: 'asgnAst' }, { path: 'tsfrAst.IN' }, { path: 'tsfrAst.OUT' }])
    
    if (baseDoc === null) {
      return res.status(400).send({
        success: false,
        message: 'Base Not Found'
      })
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

