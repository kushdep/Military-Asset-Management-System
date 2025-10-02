import mongoose from "mongoose"
import "./base.js"
import "./asset.js"
import "./transfer.js"

const assignSchema = new mongoose.Schema({
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
            asset: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset',
                required: true
            },
            pcngDtls:{
                qty:{
                    type: Number,
                    required: true
                },
                ttlAmt:{
                    type: Number,
                    required: true
                }
            }
        }
    ]
}, { timestamps: true })

const Purchase = mongoose.model('Purchase', assignSchema)
export default Purchase
