import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    guid: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ?? mongoose.model("FIle", ProductSchema);
