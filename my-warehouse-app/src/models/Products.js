import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0 },
    thumbnail_guid: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product ??
  mongoose.model("Product", ProductSchema);
