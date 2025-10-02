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
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    metric:{
        type: String,
        required: true,
    },
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
}, { timestamps: true })

const Asset = mongoose.model('Asset', assetSchema)
export default Asset
