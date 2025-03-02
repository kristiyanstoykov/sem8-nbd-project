import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  timestamps: true,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
