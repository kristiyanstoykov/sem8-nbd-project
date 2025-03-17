import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create an index on expiresAt for automatic expiration
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
