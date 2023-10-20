import mongoose, { Schema } from "mongoose";

const categoryShema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    maxLength: 64,
    unique: true,
  },
  slug: {
    unique: true,
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("Category", categoryShema);

// this is the schema
