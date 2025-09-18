import { Request, Response } from "express";
import {
  getPaginatedNotes,
  getNoteById,
  createNote,
  updateNoteById,
  deleteNoteById,
  getNoteByIndex,
  updateNoteByIndex,
  deleteNoteByIndex,
} from "../services/noteService";
import { AuthenticatedRequest } from "../middlewares/auth";

export const getNotes = async (req: Request, res: Response) => {
  const _page = parseInt(req.query._page as string) || 1;
  const _per_page = parseInt(req.query._per_page as string) || 10;

  const { notes, count } = await getPaginatedNotes(_page, _per_page);
  res.setHeader("X-Total-Count", count.toString());
  res.status(200).json(notes);
};

export const getNote = async (req: Request, res: Response) => {
  const note = await getNoteById(req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.status(200).json(note);
};

export const addNote = async (req: AuthenticatedRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Extract user info from authenticated request
  const user = req.user;
  const author = user ? { name: user.name, email: user.email } : null;

  const newNote = await createNote({
    title,
    content,
    author,
    user: user ? user._id : null,
  });
  res.status(201).json(newNote);
};

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Get the note to check ownership
  const existingNote = await getNoteById(id);
  if (!existingNote) {
    return res.status(404).json({ error: "Note not found" });
  }

  // Check if user is the author
  if (
    existingNote.user &&
    existingNote.user.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ error: "Access denied. You can only edit your own notes." });
  }

  const updatedNote = await updateNoteById(id, { title, content });

  res.status(200).json(updatedNote);
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Get the note to check ownership
  const existingNote = await getNoteById(id);
  if (!existingNote) {
    return res.status(404).json({ error: "Note not found" });
  }

  // Check if user is the author
  if (
    existingNote.user &&
    existingNote.user.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ error: "Access denied. You can only delete your own notes." });
  }

  const deletedNote = await deleteNoteById(id);

  res.status(204).end(); // No Content
};

export const getNoteByIndexHandler = async (req: Request, res: Response) => {
  const i = parseInt(req.params.i);

  if (isNaN(i) || i < 0) {
    return res.status(400).json({ error: "Invalid index" });
  }

  const note = await getNoteByIndex(i);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.status(200).json(note);
};

export const updateNoteByIndexHandler = async (req: Request, res: Response) => {
  const i = parseInt(req.params.i);
  const { title, content, author } = req.body;

  if (isNaN(i) || i < 0) {
    return res.status(400).json({ error: "Invalid index" });
  }

  if (!title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updatedNote = await updateNoteByIndex(i, { title, content, author });

  if (!updatedNote) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.status(200).json(updatedNote);
};

export const deleteNoteByIndexHandler = async (req: Request, res: Response) => {
  const i = parseInt(req.params.i);

  if (isNaN(i) || i < 0) {
    return res.status(400).json({ error: "Invalid index" });
  }

  const deleted = await deleteNoteByIndex(i);

  if (!deleted) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.status(204).end(); // No Content
};
