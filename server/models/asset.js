import mongoose from "mongoose"
import "./base.js"
import "./transfer.js"


const assetSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:['VCL','AMU','WEA'],
        required:true
    },
    name:{
        type:String,
        required:true
    },
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    purchaseId: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    assignId:[{
        type: mongoose.Schema.Types.ObjectId,
    }],
    tfrId:[{
        type: mongoose.Schema.Types.ObjectId,
    }]
}, { timestamps: true })

const Asset = mongoose.model('Asset', assetSchema)
export default Asset
