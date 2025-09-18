import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
); // prevent an automatic _id inside author

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: {
    type: authorSchema,
    required: false,
    default: null,
  },
  content: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

export const Note = mongoose.model("Note", noteSchema);
