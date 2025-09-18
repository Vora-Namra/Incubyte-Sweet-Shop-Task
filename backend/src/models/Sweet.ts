import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

const Sweet = mongoose.model('Sweet', sweetSchema);
export default Sweet;
