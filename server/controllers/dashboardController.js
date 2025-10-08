import Asset from "../models/asset.js"
import Assign from "../models/assign.js"
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
            qty: ele.qty,
            metric: ele.metric
          })
        }
        else if (ele.type === 'WEA') {
          oldAstIdsArr.Weapons.push({
            id: ele._id,
            qty: ele.qty,
            metric: ele.metric
          })
        }
        else if (ele.type === 'AMU') {
          oldAstIdsArr.Ammunition.push({
            id: ele._id,
            qty: ele.qty,
            metric: ele.metric
          })
        }
      })
    }


    let itemIds = [
      ...newPurIdsArr.Vehicle.map(e => ({
        asset: e.asset.toString(),
        qty: `${e.qty.value} ${e.qty.metric}`
      })),
      ...newPurIdsArr.Ammunition.map(e => ({
        asset: e.asset.toString(),
        qty: `${e.qty.value} ${e.qty.metric}`
      })),
      ...newPurIdsArr.Weapons.map(e => ({
        asset: e.asset.toString(),
        qty: `${e.qty.value} ${e.qty.metric}`
      })),
      ...oldAstIdsArr.Vehicle.map(e => ({
        asset: e.id.toString(),
        qty: `${e.qty} ${e.metric}`
      })),
      ...oldAstIdsArr.Weapons.map(e => ({
        asset: e.id.toString(),
        qty: `${e.qty} ${e.metric}`
      })),
      ...oldAstIdsArr.Ammunition.map(e => ({
        asset: e.id.toString(),
        qty: `${e.qty} ${e.metric}`
      }))
    ];

    let newPurchase = {
      Sno: purCnt,
      base: base._id,
      items: itemIds,
      addedBy: username,
      role: role
    }
    console.log(newPurchase)

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
    const { sldrId, asgnAst } = req.body;
    console.log(sldrId)
    console.log(asgnAst)

    const baseDoc = await Base.findOne({ baseId: id });
    if (!baseDoc) {
      return res.status(500).send({
        success: false,
        message: 'Base Not Found'
      });
    }

    console.log(asgnAst)
    console.log(baseDoc)
    if (asgnAst?.Vehicle.length > 0 && baseDoc?.inventory?.Vehicle.length == 0 ||
      asgnAst?.Ammunition.length > 0 && baseDoc?.inventory?.Ammunition.length == 0 ||
      asgnAst?.Weapons.length > 0 && baseDoc?.inventory?.Weapons.length == 0) {
      return res.status(400).send({
        success: false,
        message: 'Assignment Not possible'
      });
    }

    let items = []

    Object.entries(asgnAst).forEach(([key, arr]) => {
      console.log(arr)
      if (arr.length > 0) {
        console.log("2")
        arr.forEach((v) => {
          const invList = baseDoc.inventory[key];
          console.log(invList)
          const ind = invList.findIndex((e) => e._id.toString() === v.id);
          console.log(ind)
          if (ind > -1) {
            console.log("3")
            const item = invList[ind];
            if (item.qty.metric !== v.metric ||
              item.qty.value < Number(v.qty)) {
              throw Error('Assignment cant be done')
            }
            console.log("4")
            invList[ind].qty.value -= Number(v.qty)
            items.push({
              category: key,
              asset: v.id,
              name:v.name,
              totalQty: {
                value: v.qty,
                metric: v.metric
              }
            })
          } else {
            console.log("4")
            throw Error('Assignment cant be done')
          }
        });
      }
    });

    console.log(sldrId)
    console.log(items)

    let newAssign = {
      sId: sldrId,
      baseId: baseDoc._id,
      items
    }
    console.log(newAssign)

    const newAssignDoc = await Assign.create(newAssign)

    const updAstval = await Promise.all(
      items.map(ele =>
        Asset.findByIdAndUpdate(
          ele.asset,
          { $push: { assignId: newAssignDoc._id } }
        )
      )
    )
    if (!updAstval) {
      return res.status(400).send({
        success: false,
        message: 'Base Not Found'
      });
    }
    baseDoc.asgnAst.push(newAssignDoc._id)
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
    const baseDoc = await Base.findOne({ baseId: id }).populate([{ path: 'purchase', populate: { path: 'items.asset' } }, { path: 'inventory.Vehicle.asset' }, { path: 'inventory.Weapons.asset' }, { path: 'inventory.Ammunition.asset' },{path:'asgnAst'}])
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