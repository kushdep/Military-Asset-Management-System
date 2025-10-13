import logger from './logger.js'
import Asset from './models/asset.js';
import Assign from './models/assign.js';
import Base from './models/base.js';
import Purchase from './models/purchase.js';

const today = new Date()
const monthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
const monthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

export const updateInventory = async () => {
    try {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const month = months[today.getMonth()]
        const cursor = Base.find().cursor();
        for await (const doc of cursor) {
            for (let [key, value] of Object.entries(doc.inventory)) {
                for (const v of value) {
                    const asset = await Asset.findById({ _id: v.asset })
                    const [purchaseQty, expendQty, transferInQty, transferOutQty] = await Promise.all([
                        getPurchaseAmount(asset.purchaseId, v.asset.toString(), doc._id.toString()),
                        getExpendAmount(asset.assignId, v.asset.toString(), doc._id.toString()),
                        transferQty(asset.tfrId, v.asset.toString(), doc._id.toString(), "to", "TINdate"),
                        transferQty(asset.tfrId, v.asset.toString(), doc._id.toString(), "by", "TOUTdate")
                    ])
                    const newOBQ = purchaseQty + transferInQty - transferOutQty - expendQty;
                    v.asset.OpeningBalQty.set(month, newOBQ)
                    logger.info('baseId ' + doc._id + ' AssetId ' + v.asset + `Opening Bal for ${month}:- ` + newOBQ);
                }
            }
        }
        logger.info('Inventory updated successfully.');
    } catch (err) {
        logger.error('Error updating inventory: ' + err.message);
    }
};

const getPurchaseAmount = async (purchArr, assetId, baseId) => {
    try {
        let purchaseAmount = 0
        if (purchArr.length === 0) return 0
        for (const p of purchArr) {
            if (p.base.toString() !== baseId) continue;
            const purchase = await Purchase.findOne({ Sno: p.Sno })
            purchase.forEach(data => {
                if (purchase.purchaseDate >= monthStart && purchase.purchaseDate <= monthEnd) {
                    purchaseAmount = data.items.reduce((sum, item) => {
                        if (item.asset.toString() !== assetId) {
                            return sum
                        }
                        return item.qty
                    }, purchaseAmount)
                }
            })
        }
        logger.info("AssetId " + assetId + " Purchase Amount " + purchaseAmount)
        return purchaseAmount
    } catch (error) {
        logger.error('Error updating inventory:getPurchaseAmount()  ' + error.message);
    }
}

const getExpendAmount = async (assgnArr, assetId, bId) => {
    try {
        if (assgnArr.length === 0) return 0
        let expendedAmount = 0
        for (const a of assgnArr) {
            const assign = await Assign.findOne(a)
            for (agn of assign) {
                if (agn.baseId.toString() !== bId) continue;
                for (d of data.items) {
                    if (d.asset.toString() !== assetId) continue;
                    d.expnd, reduce((sum, exp) => {
                        if (!(exp.expndDate >= monthStart && exp.expndDate <= monthEnd)) {
                            return sum
                        }
                        return exp.qty.value
                    }, expendedAmount)
                }
            }
        }
        logger.info("AssetId " + assetId + " Expend Amount " + expendedAmount)
        return expendedAmount
    } catch (error) {
        logger.error('Error updating inventory:getExpendAmount()  ' + error.message);
    }
}


const transferQty = async (transferArr, astId, baseId, key, dateKey) => {
    try {
        if (transferArr.length === 0) return 0
        let transferAmount = 0
        for (const t of transferArr) {
            const transfer = await Assign.findOne(t)
            for (tfr of transfer) {
                if (tfr[dateKey] >= monthStart && tfr[dateKey] <= monthEnd) {
                    if (tfr[key].toString() !== baseId && tfr.status !== 'RECEIVED') continue;
                    tfr.astDtl.reduce((sum, tfrQty) => {
                        if (item.assetId.toString() !== astId) {
                            return sum
                        }
                        return tfrQty.totalQty.value
                    }, transferAmount)
                }
            }
        }
        logger.info("AssetId " + assetId + " Transfer Amount " + transferAmount)
        return transferAmount
    } catch (error) {
        logger.error('Error updating inventory:getExpendAmount()  ' + error.message);
    }
}

