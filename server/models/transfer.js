import mongoose, { Schema, Types } from "mongoose";

const transferSchema = new Schema({
    trnsfrType: {
        type: String,
        enum:['IN','OUT'],
        required: true
    },
    to:{
        type: Types.ObjectId,
        required:true
    },
    by:{
        type: Types.ObjectId,
        required:true
    },
    astDtl:{
        name:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        qty:{
            type: Number,
            required: true
        },
        ttlAmt:{
            type: Number,
            required: true
        }
    },
}, { timestamps: true })

const Transfer = mongoose.model('Transfer', transferSchema)
export default Transfer