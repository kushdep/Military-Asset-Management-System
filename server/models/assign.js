import mongoose from "mongoose"
import "./base.js"
import "./asset.js"
import "./transfer.js"

const assignSchema = new mongoose.Schema({
    SId: {
        type: Number,
        required: true,
        unique: true
    },
    items: [
        {
            asset: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            toalQty:{

            },

            status:{
                type:String,
                enum:['Asgnd','Expd']
            },
            expnd:{
                qty: {
                value:{
                    type: Number,
                    required: true
                },
                metric:{
                    type:String,
                    required:true
                }
            },
                expndDate:Date
            }
        }
    ]
}, { timestamps: true })

const Purchase = mongoose.model('Purchase', assignSchema)
export default Purchase
