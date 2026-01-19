import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { deleteNote } from '../services/storage';

const NoteDetailScreen = ({ route, navigation }) => {
  const { note } = route.params;

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

  const handleDelete = () => {
    Alert.alert(
      'Usuń notatkę',
      'Czy na pewno chcesz usunąć tę notatkę?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(note.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Błąd', 'Nie udało się usunąć notatki');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddEditNote', { note });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>{formatDate(note.date)}</Text>

        {note.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: note.image }} style={styles.image} />
          </View>
        )}

        {note.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>📍 Lokalizacja:</Text>
            <Text style={styles.locationText}>
              {note.location.latitude.toFixed(6)}, {note.location.longitude.toFixed(6)}
            </Text>
            {note.location.address && (
              <Text style={styles.locationAddress}>{note.location.address}</Text>
            )}
          </View>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{note.description}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel="Edytuj notatkę"
          >
            <Text style={styles.buttonText}>Edytuj</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Usuń notatkę"
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>Usuń</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  locationContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 100,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  editButton: {
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteButtonText: {
    color: '#d32f2f',
  },
});

export default NoteDetailScreen;
