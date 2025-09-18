import { useState } from "react";
import { Note as NoteType } from "../Note";
import { useNotes } from "../contexts/NotesContext";
import { useAuth } from "../contexts/AuthContext";
import { handleApiError, isAuthError } from "../services/errorService";
import "./Note.css";

const BASE_URL = "http://localhost:3001";

interface NoteProps {
  note: NoteType;
  canEdit?: boolean;
  token?: string | null;
}

export const Note = ({ note, canEdit = false, token }: NoteProps) => {
  const { dispatch } = useNotes();
  const { dispatch: authDispatch } = useAuth();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(note.content);

  const handleDelete = async () => {
    if (!token) {
      dispatch({
        type: "set_notification",
        notification: "Authentication required",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/notes/${note._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        dispatch({ type: "delete_note", id: note._id });
        dispatch({ type: "set_notification", notification: "Note deleted" });
      } else {
        const errorData = await response.json();
        const errorMessage = handleApiError({
          response: { status: response.status, data: errorData },
        });
        dispatch({ type: "set_notification", notification: errorMessage });

        if (response.status === 401) {
          authDispatch({ type: "LOGOUT" });
        }
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: "set_notification", notification: errorMessage });

      if (isAuthError(error)) {
        authDispatch({ type: "LOGOUT" });
      }
    }
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setContent(note.content);
  };

  const handleSave = async () => {
    if (!token) {
      dispatch({
        type: "set_notification",
        notification: "Authentication required",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: note.title, content }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        dispatch({ type: "update_note", note: updatedNote });
        dispatch({ type: "set_notification", notification: "Note updated" });
        setEditing(false);
      } else {
        const errorData = await response.json();
        dispatch({
          type: "set_notification",
          notification: errorData.error || "Failed to update the note.",
        });
      }
    } catch (error) {
      dispatch({
        type: "set_notification",
        notification: "An error occurred while updating the note.",
      });
    }
  };

  return (
    <div className="note" data-testid={note._id}>
      <h2>{note.title}</h2>
      {note.author && <small>By {note.author.name}</small>}
      {!editing ? (
        <>
          <p>{note.content}</p>
          {canEdit && (
            <>
              <button data-testid={`delete-${note._id}`} onClick={handleDelete}>
                Delete
              </button>
              <button data-testid={`edit-${note._id}`} onClick={handleEdit}>
                Edit
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <textarea
            data-testid={`text_input-${note._id}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            data-testid={`text_input_save-${note._id}`}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            data-testid={`text_input_cancel-${note._id}`}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};
