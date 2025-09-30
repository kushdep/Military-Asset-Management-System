import mongoose from "mongoose"

const baseSchema = new mongoose.Schema({
    BaseNo: {
        type: Number,
        required: true,
        unique: true
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
        asndAst: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset'
            }
        ]
    }]
}, { timestamps: true })

const Base = mongoose.model('Base', baseSchema)
export default Base
