import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addNote, updateNote } from '../services/storage';
import { saveNote as saveNoteToAPI } from '../services/api';

const AddEditNoteScreen = ({ route, navigation }) => {
  const existingNote = route.params?.note;
  const isEditing = !!existingNote;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [description, setDescription] = useState(existingNote?.description || '');
  const [image, setImage] = useState(existingNote?.image || null);
  const [location, setLocation] = useState(existingNote?.location || null);
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Brak uprawnień', 'Aplikacja potrzebuje uprawnień do aparatu');
      return false;
    }
    return true;
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Brak uprawnień', 'Aplikacja potrzebuje uprawnień do lokalizacji');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zrobić zdjęcia');
      console.error(error);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Brak uprawnień', 'Aplikacja potrzebuje uprawnień do galerii');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się wybrać zdjęcia');
      console.error(error);
    }
  };

  const handleGetLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address: null,
      });

      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeocode) {
        const address = `${reverseGeocode.street || ''} ${reverseGeocode.city || ''}`.trim();
        setLocation(prev => ({ ...prev, address: address || null }));
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać lokalizacji');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Błąd', 'Podaj tytuł notatki');
      return;
    }

    try {
      setLoading(true);
      const noteData = {
        title: title.trim(),
        description: description.trim(),
        image,
        location,
      };

      if (isEditing) {
        await updateNote(existingNote.id, noteData);
      } else {
        await addNote(noteData);
        await saveNoteToAPI(noteData);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zapisać notatki');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tytuł *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Podaj tytuł notatki"
            accessibilityLabel="Pole tytułu notatki"
            accessible={true}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Opis</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Opisz notatkę..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            accessibilityLabel="Pole opisu notatki"
            accessible={true}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Zdjęcie</Text>
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={handleTakePhoto}
              accessibilityRole="button"
              accessibilityLabel="Zrób zdjęcie"
              accessibilityHint="Otwiera aparat, aby zrobić zdjęcie"
            >
              <Text style={styles.imageButtonText}>📷 Zrób zdjęcie</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={handlePickImage}
              accessibilityRole="button"
              accessibilityLabel="Wybierz z galerii"
              accessibilityHint="Otwiera galerię, aby wybrać zdjęcie"
            >
              <Text style={styles.imageButtonText}>🖼️ Wybierz z galerii</Text>
            </TouchableOpacity>
          </View>
          {image && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
                accessibilityRole="button"
                accessibilityLabel="Usuń zdjęcie"
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lokalizacja</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleGetLocation}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Pobierz lokalizację GPS"
            accessibilityHint="Pobiera aktualną pozycję GPS"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.locationButtonText}>📍 Pobierz lokalizację</Text>
            )}
          </TouchableOpacity>
          {location && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
              {location.address && (
                <Text style={styles.locationAddress}>{location.address}</Text>
              )}
              <TouchableOpacity
                onPress={() => setLocation(null)}
                accessibilityRole="button"
                accessibilityLabel="Usuń lokalizację"
              >
                <Text style={styles.removeLocationText}>Usuń lokalizację</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? "Zapisz zmiany" : "Dodaj notatkę"}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Zapisz zmiany' : 'Dodaj notatkę'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 48,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagePreview: {
    position: 'relative',
    marginTop: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationInfo: {
    marginTop: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  removeLocationText: {
    fontSize: 14,
    color: '#d32f2f',
    textDecorationLine: 'underline',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditNoteScreen;
