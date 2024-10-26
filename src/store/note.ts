import { addNote, deleteNote, getUserNotes } from "@/actions/note.action";
import { Note } from "@/entities/Note";
import { create } from "zustand";

export type NoteStore = {
  notes: Note[];
  add: (note: Note) => Promise<void>;
//   remove: (id: number) => void;
  loadNotes: () => Promise<void>;
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],

  add: async (note) => {
    const result = await addNote(note); // Assumes addNote returns { success: boolean, error?: string }
    if (result.success && result.note) {
      set((state) => ({ notes: [...state.notes, result.note] }));
    } else {
      console.error(result.error); // Handle or display this error as needed
    }
  },

  remove: async (id: string) => {
    const result = await deleteNote(id)
    if(result.success && result.note) {
        set((state) => ({ notes: [...state.notes, result.note] }));
    }else{
        console.error(result.error);
    }
  },

  loadNotes: async () => {
    const result = await getUserNotes(); // Assumes getUserNotes returns { success: boolean, notes?: Note[] }
    if (result.success && result.notes) {
      set({ notes: result.notes });
    } else {
      console.error(result.error); // Handle or display this error as needed
    }
  },
}));
