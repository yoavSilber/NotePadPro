import { Note } from "../models/noteModel";
import mongoose from "mongoose";

export const getPaginatedNotes = async (_page: number, _per_page: number) => {
  const skip = (_page - 1) * _per_page;
  const notes = await Note.find().sort({ _id: -1 }).skip(skip).limit(_per_page);
  const count = await Note.countDocuments();
  return { notes, count };
};

export const getNoteById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Note.findById(id);
};

export const createNote = async (data: {
  title: string;
  content: string;
  author?: { name: string; email: string } | null;
  user?: string | null;
}) => {
  const note = new Note({
    title: data.title,
    content: data.content,
    author: data.author || null,
    user: data.user || null,
  });

  return await note.save();
};

export const updateNoteById = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    author?: { name: string; email: string } | null;
  }
) => {
  return await Note.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNoteById = async (id: string) => {
  return await Note.findByIdAndDelete(id);
};

export const getNoteByIndex = async (i: number) => {
  const notes = await Note.find().sort({ _id: -1 }).skip(i).limit(1);
  return notes[0] || null;
};

export const updateNoteByIndex = async (
  i: number,
  data: {
    title: string;
    content: string;
    author?: { name: string; email: string } | null;
  }
) => {
  const notes = await Note.find().sort({ _id: -1 }).skip(i).limit(1);
  const target = notes[0];

  if (!target) return null;

  target.title = data.title;
  target.content = data.content;
  target.author = data.author || null;

  return await target.save();
};

export const deleteNoteByIndex = async (i: number) => {
  const notes = await Note.find().sort({ _id: -1 }).skip(i).limit(1);
  const target = notes[0];

  if (!target) return null;

  return await Note.findByIdAndDelete(target._id);
};
