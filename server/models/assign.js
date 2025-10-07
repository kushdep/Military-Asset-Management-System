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
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: true
  },
  items: {
    items: [
      {
        category: {
          type: String,
          enum: ["Vehicle", "Weapons", "Ammunition"], 
          required: true,
        },
        asset: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Asset",
          required: true,
        },
        totalQty: {
          value: { type: Number, required: true },
          metric: { type: String, required: true },
        },
        expnd: [
          {
            qty: {
              value: { type: Number, required: true },
              metric: { type: String, required: true },
            },
            expndDate: { type: Date },
          },
        ],
      },
    ],
  }
}, { timestamps: true });

const Assign = mongoose.model('Assign', assignSchema);
export default Assign;
