//this is the model shema
import mongoose, { Schema } from "mongoose";

const { User } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
      max: 64,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      require: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
