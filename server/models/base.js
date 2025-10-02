import mongoose from "mongoose"
import "./purchase.js"
import "./asset.js"
import "./transfer.js"

const baseSchema = new mongoose.Schema({
    baseId: {
        type: Number,
        required: true,
        unique: true
    },
    baseName: {
        type: String,
        required: true,
    },
    inventory: {
        Vehicle: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asset'
        }],
        Weapons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asset'
        }],
        Ammunition: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asset'
        }],
    },
    tsfrAst: {
        IN: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transfer'
        }],
        OUT: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transfer'
        }]
    },
    purchase: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase'
    }],
    baseComm: {
        type: String,
        required: true
    },
    lgstcOff: {
        type: String,
        required: true
    },
    sldrs: [{
        sId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['M', 'F']
        },
        asndAst: [{
            sldrId: {
                type: String,
                required: true
            },
            asndDate: {
                type: Date,
                required: true
            },
            asgnAst: [{
                astId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                qty: { type: Number, required: true }
            }]
        }
        ]
    }]
}, { timestamps: true })

const Base = mongoose.model('Base', baseSchema)
export default Base
