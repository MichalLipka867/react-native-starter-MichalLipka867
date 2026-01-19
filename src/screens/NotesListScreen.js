import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getNotes } from '../services/storage';
import { fetchNotes as fetchNotesFromAPI } from '../services/api';

const NotesListScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const localNotes = await getNotes();
      
      if (localNotes.length === 0) {
        const apiNotes = await fetchNotesFromAPI();
        setNotes(apiNotes);
      } else {
        setNotes(localNotes);
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się załadować notatek');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => navigation.navigate('NoteDetail', { note: item })}
      accessibilityRole="button"
      accessibilityLabel={`Notatka: ${item.title}`}
      accessibilityHint="Naciśnij, aby zobaczyć szczegóły"
    >
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.noteDate}>{formatDate(item.date)}</Text>
        {item.location && (
          <Text style={styles.noteLocation}>📍 Lokalizacja: {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}</Text>
        )}
        {item.image && (
          <Text style={styles.noteImage}>📷 Zdjęcie dostępne</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak notatek</Text>
            <Text style={styles.emptySubtext}>Dodaj pierwszą notatkę!</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditNote', { note: null })}
        accessibilityRole="button"
        accessibilityLabel="Dodaj nową notatkę"
        accessibilityHint="Otwiera formularz dodawania notatki"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
        accessibilityRole="button"
        accessibilityLabel="Otwórz ustawienia"
      >
        <Text style={styles.settingsText}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 48,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  noteLocation: {
    fontSize: 12,
    color: '#6200ee',
    marginTop: 4,
  },
  noteImage: {
    fontSize: 12,
    color: '#6200ee',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsButton: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  settingsText: {
    fontSize: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
  },
});

export default NotesListScreen;
