import mongoose from "mongoose"
import "./purchase.js"
import "./asset.js"
import "./transfer.js"

const baseSchema = new mongoose.Schema({
    baseId: {
        type: String,
        required: true,
        unique: true
    },
    baseName: {
        type: String,
        required: true,
    },
    inventory: {
        Vehicle: [{
            asset: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset'
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
            OpeningBalQty: {
                type: Number,
                required: true
            }
        }],
        Weapons: [{
            asset: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset'
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
            OpeningBalQty: {
                type: Number,
                required: true
            }
        }],
        Ammunition: [{
            asset: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset'
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
            OpeningBalQty: {
                type: Number,
                required: true
            }
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
        asgnAst: [{
            type: mongoose.Schema.Types.ObjectId,
        }],
    }],
    asgnAst: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assign'
    }],
}, { timestamps: true })

const Base = mongoose.model('Base', baseSchema)
export default Base
