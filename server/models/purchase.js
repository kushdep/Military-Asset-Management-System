import mongoose from "mongoose"
import "./base.js"
import "./asset.js"
import "./transfer.js"

const purchaseSchema = new mongoose.Schema({
    Sno: {
        type: Number,
        required: true,
        unique: true
    },
    base: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [
        {
            asset:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset',
                required: true
            },
            qty:{
                type:Number,
            }
        }
    ],
    addedBy: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    purchaseDate:{
        type:Date,
        default:Date.now
    }
}, { timestamps: true })

const Purchase = mongoose.model('Purchase', purchaseSchema)
export default Purchase
