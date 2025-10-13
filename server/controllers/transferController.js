import Base from "../models/base.js";
import Transfer from "../models/transfer.js";

export const transferBaseAst = async (req, res) => {
  try {
    const { id: fromBaseId } = req.params;
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

    console.log(Object.entries(trnsfrAst))

    let items = []
    Object.entries(trnsfrAst).forEach(([key, arr]) => {
      if (arr.length > 0) {
        console.log("2")
        arr.forEach((v) => {
          const invList = baseDoc.inventory[key];
          console.log(invList)
          const ind = invList.findIndex((e) => e.asset.toString() === v.id);
          console.log(ind)
          if (ind > -1) {
            console.log("3")
            const item = invList[ind];
            if (item.qty.value < Number(v.qty)) {
              throw Error('Transfer cant be done')
            }
            console.log("4")
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
            console.log("4")
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
    console.log(newTranfer)

    const newTranferDoc = await Transfer.create(newTranfer)
    console.log("------------")
    console.log(newTranferDoc)
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

    const recBaseDoc = await Base.findOneAndUpdate({ baseId: toBaseId }, { $push: { 'tsfrAst.IN': newTranferDoc._id } })
    if (!recBaseDoc) {
      return res.status(400).send({
        success: false,
        message: 'Reciever Base Not Found'
      });
    }
    return res.status(200).send({
      success: true,
      message: 'Transfer Details Updated'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

export const recieveBaseAst = async (req, res) => {
  try {
    const { status } = req.query
    const {role } = req.user
    console.log(status)
     if(role!=='AD' && role!=='LGOF'){
      return res.status(403).send({
        success: false,
        message: 'UNAUTHORIZED'
      })
    }

    if (status === 'true') {
      console.log('In Success')
      const response = await setAssetRecieved(req, res)
      console.log(response)
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
      console.log('In Fail')
      const response = await setAssetCancelled(req, res)
      console.log(response)
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
    console.log(error);
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
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const transferDoc = await Transfer.findOne({ _id: tfrId })
    if (!transferDoc) {
      return {
        success: false,
        status: 500,
        message: 'Transfer Data Not Found'
      }
    }

    console.log(transferDoc)
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
      console.log(invList)
      const ind = invList.findIndex((e) => e.asset.toString() === asset.assetId.toString());
      console.log(ind)
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

    return {
      success: true,
      status: 200,
      message: 'Transfer Update SuccessFully'
    }

  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: error.message
    }
  }
}

const setAssetCancelled = async (req, res) => {
  try {
    const { tfrId } = req.body
    const transferDoc = await Transfer.findById({ _id: tfrId })
    if (!transferDoc) {
      return {
        success: false,
        status: 400,
        message: 'Transfer Data Not Found'
      };
    }

    console.log(transferDoc)
    const { astDtl } = transferDoc

    if (astDtl.length === 0) {
      return {
        success: false,
        status: 400,
        message: 'Assets Not Found'
      }
    }

    const baseDoc = await Base.findOne({ baseId: transferDoc.by })
    console.log(baseDoc)

    astDtl.forEach((asset) => {
      const invList = baseDoc.inventory[asset.category];
      console.log(invList)
      const ind = invList.findIndex((e) => e.asset.toString() === asset.assetId.toString());
      console.log(ind)
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
    console.log(error);
    return {
      success: false,
      status: 500,
      message: error.message
    }
  }
};
