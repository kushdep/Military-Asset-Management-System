import Asset from "../models/asset.js";
import Base from "../models/base.js";
import Purchase from "../models/purchase.js";
import logTransaction from "../transactionLogger.js"

export const addNewPurchaseData = async (req, res) => {
  try {
    const { id } = req.params;
    const { username = null, role = null, baseId = null } = req.user
    if (!username || !role || (role !== 'AD' && !baseId)) {
      return res.status(401).send({
        success: false,
        message: 'Invalid Token'
      });
    }

    const { oldAst = [], newAst = [] } = req.body;
    let purCnt = await Purchase.countDocuments() + 1
    const base = await Base.findOne({ baseId: id })
    if (!base) {
      return res.status(400).send({
        success: false,
        message: 'Base Not Found'
      });
    }

    let newPurIdsArr = { Vehicle: [], Ammunition: [], Weapons: [] }
    let oldAstIdsArr = { Vehicle: [], Ammunition: [], Weapons: [] }

    if (newAst.length > 0) {
      const newAssets = newAst.map((n) => {
        const doc = {
          type: n.type,
          name: n.name,
          ownedBy: base._id,
          purchaseId: [],
          assignId: [],
          tfrId: [],
        }
        doc['purchaseId'].push({ Sno: Number(purCnt) })
        return doc
      })
      let insertedAssetDocs = await Asset.insertMany(newAssets)
      insertedAssetDocs.forEach((ele, i) => {
        const original = newAst[i];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = months[new Date().getMonth()]
        if (ele.type === 'VCL') {
          newPurIdsArr.Vehicle.push({
            asset: ele._id,
            qty: {
              value: original.qty,
              metric: original.metric
            },
            OpeningBalQty: { [month]: original.qty }
          })
        }
        else if (ele.type === 'WEA') {
          newPurIdsArr.Weapons.push({
            asset: ele._id,
            qty: {
              value: original.qty,
              metric: original.metric
            },
            OpeningBalQty: { [month]: original.qty }
          })
        }
        else if (ele.type === 'AMU') {
          newPurIdsArr.Ammunition.push({
            asset: ele._id,
            qty: {
              value: original.qty,
              metric: original.metric
            },
            OpeningBalQty: { [month]: original.qty }
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
        qty: e.qty.value
      })),
      ...newPurIdsArr.Ammunition.map(e => ({
        asset: e.asset.toString(),
        qty: e.qty.value
      })),
      ...newPurIdsArr.Weapons.map(e => ({
        asset: e.asset.toString(),
        qty: e.qty.value
      })),
      ...oldAstIdsArr.Vehicle.map(e => ({
        asset: e.id.toString(),
        qty: e.qty
      })),
      ...oldAstIdsArr.Weapons.map(e => ({
        asset: e.id.toString(),
        qty: e.qty
      })),
      ...oldAstIdsArr.Ammunition.map(e => ({
        asset: e.id.toString(),
        qty: e.qty
      }))
    ];

    let newPurchase = {
      Sno: purCnt,
      base: base._id,
      items: itemIds,
      addedBy: username,
      role: role,
    }

    const purchDoc = await Purchase.create(newPurchase)
    if (!purchDoc) {
      return res.status(400).send({
        success: false,
        message: 'Purchase Not Done'
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
    logTransaction('Purchase data inserted ',`${username} role-${role}`,{base:id,purchaseID:purchDoc._id})

    return res.status(200).send({
      success: true,
      data: baseDoc,
      message: 'Base Details Updated'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};
