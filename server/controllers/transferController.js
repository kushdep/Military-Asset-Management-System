import Asset from "../models/asset.js";
import Base from "../models/base.js";
import Transfer from "../models/transfer.js";
import logTransaction from "../transactionLogger.js"

export const transferBaseAst = async (req, res) => {
  try {
    const { id: fromBaseId } = req.params;
    const {username,role} = req.params
    const { toBaseId, trnsfrAst } = req.body;
    if (fromBaseId === toBaseId) {
      return res.status(500).send({
        success: false,
        message: 'Transfer can not be done on same base'
      });
    }
    const baseDoc = await Base.findOne({ baseId: fromBaseId });
    if (!baseDoc) {
      return res.status(500).send({
        success: false,
        message: 'Sender Base Not Found'
      });
    }
    if (trnsfrAst?.Vehicle.length > 0 && baseDoc?.inventory?.Vehicle.length == 0 ||
      trnsfrAst?.Ammunition.length > 0 && baseDoc?.inventory?.Ammunition.length == 0 ||
      trnsfrAst?.Weapons.length > 0 && baseDoc?.inventory?.Weapons.length == 0) {
      return res.status(400).send({
        success: false,
        message: 'Transfer Not possible'
      });
    }


    let items = []
    Object.entries(trnsfrAst).forEach(([key, arr]) => {
      if (arr.length > 0) {
        arr.forEach((v) => {
          const invList = baseDoc.inventory[key];
          const ind = invList.findIndex((e) => e.asset.toString() === v.id);
          if (ind > -1) {
            const item = invList[ind];
            if (item.qty.value < Number(v.qty)) {
              throw Error('Transfer cant be done')
            }
            invList[ind].qty.value -= Number(v.qty)
            items.push({
              category: key,
              assetId: v.id,
              name: v.name,
              totalQty: {
                value: v.qty,
                metric: v.metric
              },
            })
          } else {
            throw Error('Transfer cant be done')
          }
        });
      }
    });

    let newTranfer = {
      to: toBaseId,
      by: fromBaseId,
      status: 'PENDING',
      astDtl: items,
      TOUTdate: new Date(),
    }

    const newTranferDoc = await Transfer.create(newTranfer)
    logTransaction('Asset Transfer ', `${username} role-${role}`, { baseId: fromBaseId, To: toBaseId, AssetLen: trnsfrAst.length, status: 'Pending' })
    if (!newTranferDoc) {
      return res.status(500).send({
        success: false,
        message: 'Something went wrong'
      });
    }

    const updAstval = await Promise.all(
      items.map(ele =>
        Asset.findByIdAndUpdate(
          { _id: ele.assetId },
          { $push: { tfrId: newTranferDoc._id } }
        )
      )
    )
    if (!updAstval) {
      return res.status(400).send({
        success: false,
        message: 'Asset Not Found'
      });
    }
    baseDoc.tsfrAst.OUT.push(newTranferDoc._id)
    const updBase = await baseDoc.save()
    if (!updBase) {
      return res.status(400).send({
        success: false,
        message: 'Unable to update'
      });
    }
    logTransaction('Transfering Base ', `${username} role-${role}`, { baseId: fromBaseId, transferId: newTranferDoc._id })

    const recBaseDoc = await Base.findOneAndUpdate({ baseId: toBaseId }, { $push: { 'tsfrAst.IN': newTranferDoc._id } })
    if (!recBaseDoc) {
      return res.status(400).send({
        success: false,
        message: 'Reciever Base Not Found'
      });
    }

    logTransaction('Recieving Base ', `${username} role-${role}`, { baseId: toBaseId, transferId: newTranferDoc._id })
    return res.status(200).send({
      success: true,
      message: 'Transfer Details Updated'
    });

  } catch (error) {
    console.error("Error in TransferBaseAst" + error);
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

export const recieveBaseAst = async (req, res) => {
  try {
    const { status } = req.query
    const { useranme,role } = req.user
    if (role !== 'AD' && role !== 'LGOF') {
      return res.status(403).send({
        success: false,
        message: 'UNAUTHORIZED'
      })
    }

    if (status === 'true') {
      const response = await setAssetRecieved(req, res)
      if (!response.success) {
        return res.status(response.status).send({
          success: false,
          message: response.message
        })
      }
      return res.status(response.status).send({
        success: true,
        message: response.message
      })
    } else {
      const response = await setAssetCancelled(req, res)
      if (!response.success) {
        return res.status(response.status).send({
          success: false,
          message: response.message
        })
      }
      return res.status(Number(response.status)).send({
        success: true,
        message: response.message
      })
    }
  } catch (error) {
    console.error("Error in RecieveAst" + error);
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
}

const setAssetRecieved = async (req, res) => {
  try {
    const { tfrId } = req.body
    const { id } = req.params
    const { username, role } = req.user
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const transferDoc = await Transfer.findOne({ _id: tfrId })
    if (!transferDoc) {
      return {
        success: false,
        status: 500,
        message: 'Transfer Data Not Found'
      }
    }

    const { astDtl } = transferDoc

    if (astDtl.length === 0) {
      return {
        success: false,
        status: 400,
        message: 'Assets Not Found'
      }
    }

    const baseDoc = await Base.findOne({ baseId: id })
    astDtl.forEach((asset) => {
      const invList = baseDoc.inventory[asset.category];
      const ind = invList.findIndex((e) => e.asset.toString() === asset.assetId.toString());
      if (ind > -1) {
        baseDoc.inventory[asset.category][ind].qty.value += Number(asset.totalQty.value)
      } else {
        const month = months[new Date().getMonth()]
        baseDoc.inventory[asset.category].push({
          asset: asset.assetId,
          qty: {
            value: asset.totalQty.value,
            metric: asset.totalQty.metric
          },
          OpeningBalQty: { [month]: asset.totalQty.value }
        })
      }
    })

    const updBase = await baseDoc.save()
    if (!updBase) {
      return {
        success: false,
        status: 500,
        message: 'Base Update Failed'
      }
    }

    transferDoc.status = 'RECEIVED'
    transferDoc.TINdate = new Date('2025-09-20')

    const updTfr = await transferDoc.save()

    if (!updTfr) {
      return {
        success: false,
        status: 500,
        message: 'Transfer Deatails Update Failed'
      }
    }

    logTransaction('RECEIVED Transfer ', `${username} role-${role}`, { transferID: tfrId, RecBase: id })
    return {
      success: true,
      status: 200,
      message: 'Transfer Update SuccessFully'
    }

  } catch (error) {
    console.error("Error in SetAssetRecieved " + error);
    return {
      success: false,
      status: 500,
      message: error.message
    }
  }
}

const setAssetCancelled = async (req, res) => {
  try {
    const { id } = req.params
    const { tfrId } = req.body
    const { username, role } = req.user
    const transferDoc = await Transfer.findById({ _id: tfrId })
    if (!transferDoc) {
      return {
        success: false,
        status: 400,
        message: 'Transfer Data Not Found'
      };
    }

    const { astDtl } = transferDoc

    if (astDtl.length === 0) {
      return {
        success: false,
        status: 400,
        message: 'Assets Not Found'
      }
    }

    const baseDoc = await Base.findOne({ baseId: transferDoc.by })

    astDtl.forEach((asset) => {
      const invList = baseDoc.inventory[asset.category];
      const ind = invList.findIndex((e) => e.asset.toString() === asset.assetId.toString());
      if (ind > -1) {
        baseDoc.inventory[asset.category][ind].qty.value += Number(asset.totalQty.value)
      } else {
        throw Error('Asset Not found in Base Inventory')
      }
    })

    const updBase = await baseDoc.save()
    if (!updBase) {
      return {
        success: false,
        status: 500,
        message: 'Base Update Failed'
      }
    }

    transferDoc.status = 'CANCELLED'

    const updTfr = await transferDoc.save()
    logTransaction('CANCELLED Transfer ', `${username} role-${role}`, { transferID: tfrId, RecBase: id })
    if (!updTfr) {
      return {
        success: false,
        status: 500,
        message: 'Transfer Deatails Update Failed'
      }
    }

    return {
      success: true,
      status: 200,
      message: 'Transfer Update SuccessFully'
    }

  } catch (error) {
    console.error("Error in SetAssetCancelled " + error);
    return {
      success: false,
      status: 500,
      message: error.message
    }
  }
};
