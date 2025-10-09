import mongoose, { Schema, Types } from "mongoose";

const transferSchema = new Schema({
    to: {
        type: String,
        required: true
    },
    by: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'RECEIVED', 'CANCELLED'],
        default: 'PENDING',
    },
    astDtl: [{
        assetId: {
            type: Types.ObjectId,
            required: true
        },
        category: {
            type: String,
            enum: ['Vehicle', 'Ammunition', 'Weapons'],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        totalQty: {
            value: {
                type: Number,
                required: true
            },
            metric: {
                type: String,
                required: true
            }
        },
    }],
    TINdate:{
        type:Date,
    },
    TOUTdate:{
        type:Date,
    }
}, { timestamps: true })

const Transfer = mongoose.model('Transfer', transferSchema)
export default Transfer