import Asset from "../models/asset.js"
import Base from "../models/base.js"
import Purchase from "../models/purchase.js"

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


export const addNewPurchaseData = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.user
    const { oldAst, newAst } = req.body;
    let purCnt = await Purchase.countDocuments() + 1
    const base = await Base.findOne({ baseId: id })

    let newPurIdsArr = { Vehicle: [], Ammunition: [], Weapons: [] }
    let oldAstIdsArr = { Vehicle: [], Ammunition: [], Weapons: [] }

    if (newAst.length > 0) {
      const newAssets = newAst.map((n) => {
        const doc = {
          type: n.type,
          name: n.name,
          ownedBy: base._id,
          purchaseId: []
        }
        doc['purchaseId'].push({ Sno: Number(purCnt) })
        return doc
      })
      const insertedAssetDocs = await Asset.insertMany(newAssets)
      insertedAssetDocs.forEach((ele, i) => {
        const original = newAst[i];
        if (ele.type === 'VCL') {
          newPurIdsArr.Vehicle.push({
            asset: ele._id,
            qty: {
              value: original.qty,
              metric: original.metric
            },
            OpeningBalQty: original.qty
          })
        }
        else if (ele.type === 'WEA') {
          newPurIdsArr.Weapons.push({
            asset: ele._id,
            qty: {
              value: original.qty,
              metric: original.metric
            },
            OpeningBalQty: original.qty
          })
        }
        else if (ele.type === 'AMU') {
          newPurIdsArr.Ammunition.push({
            asset: ele._id,
            qty: {
              value: original.qty,
              metric: original.metric
            },
            OpeningBalQty: original.qty
          })
        }
      });

    }

    if (oldAst.length > 0) {
      const updAstval = await Promise.all(
        oldAst.map(ele =>
          Asset.findByIdAndUpdate(
            ele._id,
            { $push: { purchaseId: { Sno: purCnt } } }
          )
        )
      );

      if (!updAstval) {
        return res.status(400).send({
          success: false,
          message: 'Base Not Found'
        });
      }

      oldAst.forEach((ele) => {
        if (ele.type === 'VCL') {
          oldAstIdsArr.Vehicle.push({
            id: ele._id,
            qty: ele.qty
          })
        }
        else if (ele.type === 'WEA') {
          oldAstIdsArr.Weapons.push({
            id: ele._id,
            qty: ele.qty
          })
        }
        else if (ele.type === 'AMU') {
          oldAstIdsArr.Ammunition.push({
            id: ele._id,
            qty: ele.qty,
          })
        }
      })
    }
    let itemIds = [
      ...newPurIdsArr.Vehicle.map(e => e.asset.toString()),
      ...newPurIdsArr.Ammunition.map(e => e.asset.toString()),
      ...newPurIdsArr.Weapons.map(e => e.asset.toString()),
      ...oldAstIdsArr.Vehicle.map(e => e.id),
      ...oldAstIdsArr.Weapons.map(e => e.id),
      ...oldAstIdsArr.Ammunition.map(e => e.id)
    ];

    let newPurchase = {
      Sno: purCnt,
      base: base._id,
      items: itemIds,
      addedBy: username,
      role: role
    }

    const purchDoc = await Purchase.create(newPurchase)
    if (!purchDoc) {
      return res.status(400).send({
        success: false,
        message: 'Base Not Found'
      });
    }

    const baseDoc = await Base.findOne({ baseId: id });
    baseDoc.purchase.push(purchDoc._id)

    if (oldAst.length > 0) {
      oldAstIdsArr.Vehicle.forEach((v) => {
        const ind = baseDoc.inventory.Vehicle.findIndex((e) => e.asset.toString() === v.id.toString())
        if (ind > -1) {
          baseDoc.inventory.Vehicle[ind].qty.value += Number(v.qty)
        }
      })
      oldAstIdsArr.Weapons.forEach((v) => {
        const ind = baseDoc.inventory.Weapons.findIndex((e) => e.asset.toString() === v.id.toString())
        if (ind > -1) {
          baseDoc.inventory.Weapons[ind].qty.value += Number(v.qty)
        }
      })
      oldAstIdsArr.Ammunition.forEach((v) => {
        const ind = baseDoc.inventory.Ammunition.findIndex((e) => e.asset.toString() === v.id.toString())
        if (ind > -1) {
          baseDoc.inventory.Ammunition[ind].qty.value += Number(v.qty)
        }
      })
    }


    if (newAst.length > 0) {
      baseDoc.inventory.Vehicle.push(...newPurIdsArr.Vehicle)
      baseDoc.inventory.Weapons.push(...newPurIdsArr.Weapons)
      baseDoc.inventory.Ammunition.push(...newPurIdsArr.Ammunition)
    }
    await baseDoc.save()

    return res.status(200).send({
      success: true,
      data: baseDoc,
      message: 'Base Details Updated'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

export const asgnBaseAst = async (req, res) => {
  try {
    const { id } = req.params;
    const { sldrId, asgnAstIds } = req.body;
    console.log(sldrId)
    console.log(asgnAstIds)

    const astIds = asgnAstIds.map((e) => e.astId)
    console.log(astIds)

    const baseDoc = await Base.findOne({ baseId: id });
    if (!baseDoc) {
      return res.status(400).send({
        success: false,
        message: 'Base Not Found'
      });
    }

    if (baseDoc.asgnAst.length !== 0) {

    } else {
      console.log("inside else")
      baseDoc.asgnAst.push({ sldrId, asgnAstIds })
    }

    const updBase = await baseDoc.save()
    if (!updBase) {
      return res.status(400).send({
        success: false,
        message: 'Unable to update'
      });
    }



    return res.status(200).send({
      success: true,
      data: baseDoc,
      message: 'Base Details Updated'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};


export const getIdvlBaseData = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    const { role, email } = req.user
    console.log(role)
    console.log(email)
    const baseDoc = await Base.findOne({ baseId: id }).populate([{ path: 'purchase', populate: { path: 'items.asset' } }, { path: 'inventory.Vehicle.asset' }, { path: 'inventory.Weapons.asset' }, { path: 'inventory.Ammunition.asset' }])
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