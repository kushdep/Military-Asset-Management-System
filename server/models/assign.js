import mongoose from "mongoose"
import "./base.js"
import "./asset.js"
import "./transfer.js"

const assignSchema = new mongoose.Schema({
  sId: {
    type: String,
    required: true,
  },
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  items: [
    {
      category: {
        type: String,
        enum: ["Vehicle", "Weapons", "Ammunition"],
        required: true,
      },
      asset: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true
      },
      totalQty: {
        value: { type: Number, required: true },
        metric: { type: String, required: true },
      },
      asgnDate: { type: Date, default: Date.now },
      expnd: [
        {
          qty: {
            value: { type: Number, required: true },
            metric: { type: String, required: true },
          },
          expndDate: {
            type: Date,
            default: Date.now
          },
        },
      ],
    },
  ],
}, { timestamps: true });

const Assign = mongoose.model('Assign', assignSchema);
export default Assign;
