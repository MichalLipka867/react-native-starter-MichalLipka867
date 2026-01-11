import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@field_notes:notes';

export const getNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const saveNotes = async (notes) => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(NOTES_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const addNote = async (note) => {
  try {
    const notes = await getNotes();
    const newNote = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    notes.unshift(newNote);
    await saveNotes(notes);
    return newNote;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

export const updateNote = async (noteId, updatedNote) => {
  try {
    const notes = await getNotes();
    const index = notes.findIndex(n => n.id === noteId);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updatedNote };
      await saveNotes(notes);
      return notes[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const notes = await getNotes();
    const filteredNotes = notes.filter(n => n.id !== noteId);
    await saveNotes(filteredNotes);
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};
