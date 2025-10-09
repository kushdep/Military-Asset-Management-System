import mongoose, { Schema, Types } from "mongoose";

const transferSchema = new Schema({
    trnsfrType: {
        type: String,
        enum: ['IN', 'OUT'],
        required: true
    },
    to: {
        type: Types.ObjectId,
        required: true
    },
    by: {
        type: Types.ObjectId,
        required: true
    },
    status:{
        type:String,
        enum:['PENDING','RECIEVED','CANCELLED'],
        default:'PENDING',
        required:true
    },
    astDtl: [{
        assetId: {
            type: Types.ObjectId,
            required: true
        },
        qty: {
            value: {
                type: Number,
                required: true
            },
            metric: {
                type: String,
                required: true
            }
        },
    }]
}, { timestamps: true })

const Transfer = mongoose.model('Transfer', transferSchema)
export default Transfer