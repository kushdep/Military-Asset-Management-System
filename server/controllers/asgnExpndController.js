import Asset from "../models/asset.js";
import Assign from "../models/assign.js";
import Base from "../models/base.js";
import logTransaction from "../transactionLogger.js"

export const expendBaseAst = async (req, res) => {
  try {
    const { id } = req.params
    const { asgmtId, items } = req.body;
    const { username, role } = req.user
    if (role !== 'AD' && role !== 'LGOF') {
      logTransaction(true, 'EXPENDING Asset UNauthorized ', `${username} role-${role}`, { base: id, updAsgnId: asgmtId, expndAstLen: items.length })
      return res.status(403).send({
        success: false,
        message: 'UNAUTHORIZED'
      })
    }
    
    const assignDoc = await Assign.findById({ _id: asgmtId });
    if (!assignDoc) {
      logTransaction(true, 'Expend assets Assignment Not Found ', `${username} role-${role}`, { base: id, updAsgnId: asgmtId, expndAstLen: items.length })
      return res.status(500).send({
        success: false,
        message: 'Assignment Not Found'
      });
    }
    
    items.forEach((expndItem) => {
      assignDoc.items.forEach((docItems) => {
        if (expndItem.itemId === docItems._id.toString()) {
          if (expndItem.qty > docItems.totalQty.value) {
            throw Error('Expend of asset can\'t be done')
          }
          docItems.expnd.push({ qty: { value: expndItem.qty, metric: expndItem.metric }, expndDate: new Date() })
        }
      })
    })
    
    const updExpndAst = await assignDoc.save()
    if (!updExpndAst) {
      logTransaction(true, ' Updation of Assign Doc cant be done ', `${username} role-${role}`, { base: id, updAsgnId: asgmtId, expndAstLen: items.length })
      return res.status(400).send({
        success: false,
        message: 'Updation of Doc cant be done'
      });
    }

    logTransaction(false,'EXPENDING Asset ', `${username} role-${role}`, { base: id, updAsgnId: asgmtId, expndAstLen: items.length })
    return res.status(200).send({
      success: true,
      message: 'Expend details Updated'
    });

  } catch (error) {
    console.error(error);
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
    const { username, role } = req.user

    const baseDoc = await Base.findOne({ baseId: id });
    if (!baseDoc) {
          logTransaction(true,'ASSIGNING Asset Base Not Found ', `${username} role-${role}`, { base: id, assignedTo: sldrId })
          return res.status(500).send({
            success: false,
            message: 'Base Not Found'
          });
        }
        
        if (asgnAst?.Vehicle.length > 0 && baseDoc?.inventory?.Vehicle.length == 0 ||
          asgnAst?.Ammunition.length > 0 && baseDoc?.inventory?.Ammunition.length == 0 ||
          asgnAst?.Weapons.length > 0 && baseDoc?.inventory?.Weapons.length == 0) {
        logTransaction(true,'ASSIGNING Asset Asset Qty is less ', `${username} role-${role}`, { base: id, assignedTo: sldrId })
        return res.status(400).send({
          success: false,
          message: 'Assignment Not possible'
        });
      }
      
      let items = []

    Object.entries(asgnAst).forEach(([key, arr]) => {
      if (arr.length > 0) {
        arr.forEach((v) => {
          const invList = baseDoc.inventory[key];
          const ind = invList.findIndex((e) => e.asset.toString() === v.id);
          if (ind > -1) {
            const item = invList[ind];
            if (item.qty.value < Number(v.qty)) {
              throw Error('Assignment cant be done')
            }
            invList[ind].qty.value -= Number(v.qty)
            items.push({
              category: key,
              asset: v.id,
              name: v.name,
              totalQty: {
                value: v.qty,
                metric: v.metric
              },
              asgnDate: new Date(),
              expnd: []
            })
          } else {
            throw Error('Assignment cant be done')
          }
        });
      }
    });

    let newAssign = {
      sId: sldrId,
      baseId: baseDoc._id,
      items
    }
    
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
      logTransaction(true,'ASSIGNING Asset Updation Asset Failed ', `${username} role-${role}`, { base: id, assignedTo: sldrId })
      return res.status(400).send({
        success: false,
        message: 'Updation Asset Failed'
      });
    }
    baseDoc.asgnAst.push(newAssignDoc._id)
    const updBase = await baseDoc.save()
    if (!updBase) {
      logTransaction(true,'ASSIGNING Asset Updation BAse Failed ', `${username} role-${role}`, { base: id, assignedTo: sldrId })
      return res.status(400).send({
        success: false,
        message: 'Unable to update'
      });
    }

    logTransaction(false,'ASSIGNING Asset ', `${username} role-${role}`, { base: id, assignedTo: sldrId, assignmentId: newAssignDoc._id })
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