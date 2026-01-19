const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?_limit=5`);
    if (!response.ok) {
      throw new Error('Błąd pobierania notatek');
    }
    const data = await response.json();
    return data.map((post, index) => ({
      id: post.id,
      title: post.title,
      description: post.body,
      date: new Date(Date.now() - index * 86400000).toISOString(),
      image: null,
      location: null,
    }));
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const saveNote = async (note) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: note.title,
        body: note.description,
      }),
    });
    if (!response.ok) {
      throw new Error('Błąd zapisywania notatki');
    }
    const data = await response.json();
    return {
      id: data.id,
      ...note,
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
