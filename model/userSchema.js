import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  create_at: {
    type: Date,
    default: Date.now(),
  },
});

export const userModel = mongoose.model("user", userSchema);
